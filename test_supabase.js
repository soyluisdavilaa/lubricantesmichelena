require('dotenv').config({ path: 'c:/Users/soylu/Desktop/Web-LBM - copia/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log("Testing Supabase upload with BUCKET lm-assets...");
  const content = 'Test content';
  const { data, error } = await supabase.storage.from('lm-assets').upload('testing/test.txt', content, { upsert: true });
  if (error) {
    console.error("Upload error:", error.message);
  } else {
    console.log("Upload success:", data);
  }
}

testUpload();
