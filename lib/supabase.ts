
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://iwnycvkvibmjfdlnwwkf.supabase.co';
const supabaseAnonKey = 'sb_publishable_6j0No7N8lytitYgCTS-ndQ_DYFYPwt3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
