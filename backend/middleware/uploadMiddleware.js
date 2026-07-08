import multer from 'multer';
import { supabase } from '../config/supabase.js';

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, 
  }
});

const uploadToSupabase = (bucketName) => {
  return async (req, res, next) => {
    try {
      const uploadSingleFile = async (file, targetBucket) => {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(targetBucket)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (error) throw new Error(error.message);

        const { data: publicUrlData } = supabase.storage
          .from(targetBucket)
          .getPublicUrl(fileName);

        file.supabaseUrl = publicUrlData.publicUrl;
        file.supabasePath = data.path; 
      };

      if (req.file) {
        await uploadSingleFile(req.file, bucketName);
      } else if (req.files) {
        const promises = [];
        if (Array.isArray(req.files)) {
            for (const file of req.files) {
                promises.push(uploadSingleFile(file, bucketName));
            }
        } else {
            for (const fieldName in req.files) {
                // Route PDFs to the secure bucket, everything else to the default provided bucket
                const targetBucket = fieldName === 'pdf' ? 'book-pdfs' : bucketName;
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
      res.status(500).json({ message: 'File upload to Supabase failed', error: error.message });
    }
  };
};

export { upload, uploadToSupabase };
