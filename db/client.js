const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

module.exports = {
  supabase,
  isConfigured
};
