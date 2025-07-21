import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgicsrxvknzudvconhif.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaWNzcnh2a256dWR2Y29uaGlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI2MTUwOSwiZXhwIjoyMDY3ODM3NTA5fQ.F7dI543e9HPYUS8FGf5_IjqXBXFFbbXbm25Ia977drw';

export const supabase = createClient(supabaseUrl, supabaseKey); 