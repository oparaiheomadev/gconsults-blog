import { supabase } from '@/lib/supabase';

const BUCKET = 'blog-images';
const MAX_MB = 5;

// Uploads one image to Supabase Storage and gives back its public link.
// folder: 'covers' for cover images, 'content' for images inside a post.
export async function uploadImage(file, folder = 'content') {
  // 1. check the file before sending it
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_MB} MB.`);
  }

  // 2. give it a random, unique name so two files never clash
  //    e.g. covers/3f2a...c9.jpg
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  // 3. upload it
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000', // browsers may keep it for a year (name never changes)
    contentType: file.type,
  });
  if (error) throw error;

  // 4. turn the path into a link anyone can open
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
