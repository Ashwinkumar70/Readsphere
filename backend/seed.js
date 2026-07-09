import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// A list of real authors to seed
const AUTHORS_TO_SEED = [
  { name: 'Brandon Sanderson', username: 'bsanderson', bio: 'American author of epic fantasy and sci-fi.' },
  { name: 'J.K. Rowling', username: 'jkrowling', bio: 'British author, philanthropist, and screenwriter.' },
  { name: 'Stephen King', username: 'stephenking', bio: 'American author of horror, supernatural fiction, and suspense.' },
  { name: 'George R.R. Martin', username: 'grrmartin', bio: 'American novelist and short story writer.' },
  { name: 'Neil Gaiman', username: 'neilgaiman', bio: 'English author of short fiction, novels, comic books, graphic novels, and films.' },
];

async function seedData() {
  console.log("Starting Phase 0: Data Foundation...");

  try {
    const createdAuthors = [];

    for (const authorData of AUTHORS_TO_SEED) {
      console.log(`Processing author: ${authorData.name}`);
      
      // Create public.authors profile directly
      const { data: authorDataResult, error: authorError } = await supabase.from('authors').insert({
        name: authorData.name,
        bio: authorData.bio,
        is_verified: true
      }).select().single();

      if (authorError) {
        console.error(`Error inserting into public.authors for ${authorData.name}:`, authorError.message);
      } else {
        createdAuthors.push({ id: authorDataResult.id, name: authorData.name });
        console.log(`Successfully seeded author: ${authorData.name}`);
      }
    }

    if (createdAuthors.length === 0) {
      console.log("No new authors created. Fetching existing ones...");
      const { data: existingAuthors } = await supabase.from('authors').select('id, name');
      if (existingAuthors && existingAuthors.length > 0) {
        createdAuthors.push(...existingAuthors);
      } else {
        console.error("No authors found in the database. Aborting.");
        process.exit(1);
      }
    }

    console.log(`Fetching 100 books from Google Books API...`);
    
    let allBooks = [];
    for (let i = 0; i < 3; i++) {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=40&startIndex=${i * 40}&orderBy=newest`);
      const data = await response.json();
      if (data.items) {
        allBooks = allBooks.concat(data.items);
      }
    }

    allBooks = allBooks.slice(0, 100);
    console.log(`Fetched ${allBooks.length} real books from Google API. Inserting to Supabase...`);

    let successCount = 0;

    for (let i = 0; i < allBooks.length; i++) {
      const item = allBooks[i];
      const info = item.volumeInfo;
      
      if (!info.title || !info.authors || info.authors.length === 0) continue;

      const randomAuthor = createdAuthors[Math.floor(Math.random() * createdAuthors.length)];
      
      const bookPayload = {
        author_id: randomAuthor.id,
        title: info.title,
        description: info.description ? info.description.substring(0, 500) : 'No description available.',
        genre: (info.categories && info.categories.length > 0) ? info.categories[0] : 'Fiction',
        isbn: (info.industryIdentifiers && info.industryIdentifiers.length > 0) ? info.industryIdentifiers[0].identifier : null,
        language: info.language || 'en',
        page_count: info.pageCount || Math.floor(Math.random() * 300) + 100,
        publication_year: info.publishedDate ? parseInt(info.publishedDate.substring(0,4)) : 2023,
        publisher: info.publisher || 'Independent',
        cover_url: info.imageLinks ? info.imageLinks.thumbnail.replace('http:', 'https:') : null,
        price: Math.floor(Math.random() * 20) + 9.99,
        is_free: Math.random() > 0.8,
        status: 'Published'
      };

      const { error: insertError } = await supabase.from('books').insert(bookPayload);
      
      if (insertError) {
        console.error(`Error inserting book '${info.title}':`, insertError.message);
      } else {
        successCount++;
      }
    }

    console.log(`\n=== Phase 0 Complete ===`);
    console.log(`Successfully seeded ${successCount} real books.`);
    process.exit(0);

  } catch (error) {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
  }
}

seedData();
