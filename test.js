import { supabase } from './supabaseClient.js'

async function test() {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.log("Error:", error)
  } else {
    console.log("Data:", data)
  }
}

test()