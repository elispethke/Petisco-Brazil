import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://btoxxyjjvzbxcmyoawsb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_G5iPC6s3aToVQATRKFuTfA_y3tW26bz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
