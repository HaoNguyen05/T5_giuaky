import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vmpvchydpnipuaalcdug.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcHZjaHlkcG5pcHVhYWxjZHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjEwMjksImV4cCI6MjA3ODUzNzAyOX0.S52BSunRI9Z8KcIX3YIG810uldgRTHQ7QdzBdtEkj8Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
