import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mervnigxkkjisbvqrays.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcnZuaWd4a2tqaXNidnFyYXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjQxNTYsImV4cCI6MjA2NDMwMDE1Nn0.d4Nnk2P31P45MzYgLH7LaaoyIxcC29owHIPnEAtyUYM'

export const supabase = createClient(supabaseUrl, supabaseKey) 