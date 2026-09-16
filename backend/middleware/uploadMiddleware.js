import multer from 'multer';
import { supabase } from '../config/supabase.js';
import crypto from 'crypto';

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max overall
  }
});

const uploadToSupabase = (defaultBucketName = 'book-covers') => {
  return async (req, res, next) => {
    const uploadedFiles = []; // Track to rollback

    try {
      const uploadSingleFile = async (file, targetBucket) => {
        // Validation: basic file type checking based on bucket
        if (targetBucket === 'book-files' || targetBucket === 'book-previews') {
          if (file.mimetype !== 'application/pdf' && file.mimetype !== 'application/epub+zip') {
             throw new Error(`Invalid file type for ${targetBucket}. Only PDF/EPUB allowed.`);
          }
        } else if (targetBucket === 'book-covers' || targetBucket === 'author-images') {
           if (!file.mimetype.startsWith('image/')) {
             throw new Error(`Invalid file type for ${targetBucket}. Only images allowed.`);
           }
        }

        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(targetBucket)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (error) throw new Error(error.message);
        
        uploadedFiles.push({ bucket: targetBucket, path: data.path });

        const { data: publicUrlData } = supabase.storage
          .from(targetBucket)
          .getPublicUrl(fileName);

        file.supabaseUrl = publicUrlData.publicUrl;
        file.supabasePath = data.path; 
      };

      if (req.file) {
        await uploadSingleFile(req.file, defaultBucketName);
      } else if (req.files) {
        const promises = [];
        if (Array.isArray(req.files)) {
            for (const file of req.files) {
                promises.push(uploadSingleFile(file, defaultBucketName));
            }
        } else {
            for (const fieldName in req.files) {
                // Route files to specific buckets based on field name
                let targetBucket = defaultBucketName;
                if (fieldName === 'pdf' || fieldName === 'manuscript') targetBucket = 'book-files';
                else if (fieldName === 'preview') targetBucket = 'book-previews';
                else if (fieldName === 'author_image') targetBucket = 'author-images';
                else if (fieldName === 'cover') targetBucket = 'book-covers';

                for (const file of req.files[fieldName]) {
                    promises.push(uploadSingleFile(file, targetBucket));
                }
            }
        }
        await Promise.all(promises);
      }

      next();
    } catch (error) {
      console.error('Supabase upload error:', error);
      // Rollback: delete uploaded files if any error occurred
      for (const uf of uploadedFiles) {
        await supabase.storage.from(uf.bucket).remove([uf.path]).catch(err => console.error('Rollback cleanup failed:', err));
      }
      res.status(400).json({ message: 'File upload validation or storage failed', error: error.message });
    }
  };
};

export { upload, uploadToSupabase };
