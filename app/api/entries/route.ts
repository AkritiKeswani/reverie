import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase-server"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const content = typeof body?.content === "string" ? body.content.trim() : ""
  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("journal_entries")
    .insert({
      user_id: userId,
      content,
      prompt_used: typeof body.prompt_used === "string" ? body.prompt_used : null,
      mood: typeof body.mood === "string" ? body.mood : null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating journal entry:", error)
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
