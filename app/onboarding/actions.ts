"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server'
import { formSchema} from './page';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function onboardingFormSubmit(
  values: z.infer<typeof formSchema>
) {
  const user = await currentUser();
  if(user)
  {
    console.log("id:"+user.id);
    values.userId = user.id;
  }
  


  try {
    const { data, error } = await supabase
    .from('OnboardingFormResponses')
    .insert({ onboardingResponse: values })
    .select();

    if(error)console.log('Error inserting data:'+ JSON.stringify(error));
    if(data)console.log('Inserted data:'+ JSON.stringify(data));
  } catch (e) {
    return { message: "Failed to insert onboardingform" };
  }
}

// export async function deleteTodo(
//   prevState: {
//     message: string;
//   },
//   formData: FormData,
// ) {
//   const schema = z.object({
//     id: z.string().min(1),
//     todo: z.string().min(1),
//   });
//   const data = schema.parse({
//     id: formData.get("id"),
//     todo: formData.get("todo"),
//   });

//   try {
//     await sql`
//       DELETE FROM todos
//       WHERE id = ${data.id};
//     `;

//     revalidatePath("/");
//     return { message: `Deleted todo ${data.todo}` };
//   } catch (e) {
//     return { message: "Failed to delete todo" };
//   }
// }