import { NextResponse } from "next/server"
// import { createClient } from '@supabase/supabase-js'

// Uncomment when you're ready to connect to Supabase:
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// )

// Mock data for now - will be replaced with Supabase queries
const mockQuizzes = [
  {
    id: 1,
    title: "Communication Style Assessment",
    description: "Discover how you prefer to communicate and connect with others",
    category: "Social",
    questions_count: 8,
    duration_minutes: 5,
  },
  {
    id: 2,
    title: "Decision Making Patterns",
    description: "Understand your approach to making choices and solving problems",
    category: "Cognitive",
    questions_count: 12,
    duration_minutes: 7,
  },
  {
    id: 3,
    title: "Stress Response Profile",
    description: "Learn how you naturally respond to stress and pressure",
    category: "Emotional",
    questions_count: 10,
    duration_minutes: 6,
  },
  {
    id: 4,
    title: "Values & Motivation Explorer",
    description: "Identify what truly drives and motivates you in life",
    category: "Core Values",
    questions_count: 15,
    duration_minutes: 10,
  },
]

export async function GET() {
  try {
    // TODO: Replace with Supabase query when ready
    // const { data: quizzes, error } = await supabase
    //   .from('personality_quizzes')
    //   .select('*')
    //   .order('id')

    // if (error) throw error

    // For now, return mock data
    const quizzes = mockQuizzes

    return NextResponse.json({
      success: true,
      data: quizzes,
    })
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
