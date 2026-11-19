
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error) {
    return Response.json(
      { connected: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    connected: true,
    message: "اتصال به Supabase موفق بود",
    categories: data,
  });
}
