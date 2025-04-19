import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
 
type ResponseData = {
  message: string
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

 
export async function GET(
  req: NextRequest
) {


  //save req.body into supabase db
  const { data, error } = await supabase
  .from('notes')
  .insert({ title: 'Content:'
    //+JSON.stringify(req.json()) 
    })
  .select()

  console.log("req.body:");
  console.log(JSON.stringify(req.body));

  if(error){
    return Response.json({message: 'Error: req.body:<' + req.body +"> and res:<"+JSON.stringify(error)+">"});
  }


  return Response.json({ message: 'Success: req.body:<' + req.body +"> and res:<"+JSON.stringify(data)+">"});

}