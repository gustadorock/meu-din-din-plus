import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njaybiamajczdwuuwbrg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYXliaWFtYWpjemR3dXV3YnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDIwMTAsImV4cCI6MjA5NjAxODAxMH0.J6V7Xo-nXSrsjD2y9uhmH45uPT8kYmCWxvKCDKGA77E'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)