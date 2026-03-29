import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uanbqgffhczoqzpvantr.supabase.co';
const supabaseAnonKey = 'sb_publishable_a8k_2wCFGzF_8ZPYGHGTCg_PN9kwX5T';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
