// db.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL; // e.g., https://your-project.supabase.co
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // your secret key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
