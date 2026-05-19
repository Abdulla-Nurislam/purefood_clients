import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (urlMatch && keyMatch) {
  const url = urlMatch[1].trim().replace(/['"]/g, '');
  const key = keyMatch[1].trim().replace(/['"]/g, '');
  
  fetch(`${url}/rest/v1/products?select=*&limit=1`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  })
  .then(res => res.json())
  .then(data => {
      console.log("Products schema:", Object.keys(data[0] || {}));
  })
  .catch(err => console.error(err));
  
  fetch(`${url}/rest/v1/activities?select=*&limit=1`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  })
  .then(res => res.json())
  .then(data => {
      if (data.error || data.message) console.log("Activities error:", data);
      else console.log("Activities schema:", Object.keys(data[0] || {}));
  })
  .catch(err => console.error(err));
}
