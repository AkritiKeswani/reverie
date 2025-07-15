import { NextResponse } from "next/server"
// import { createClient } from '@supabase/supabase-js'

// Uncomment when you're ready to connect to Supabase:
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// )

// Mock quiz data - will be replaced with Supabase queries
const mockQuizData = {
  1: {
    id: 1,
    title: "Communication Style Assessment",
    description: "Discover how you prefer to communicate and connect with others",
    category: "Social",
    questions: [
      {
        id: 1,
        question_text: "When meeting new people, I prefer to:",
        options: [
          {
            id: 1,
            option_text: "Jump right into conversation and share about myself",
            score_value: 3,
            trait_category: "extroverted",
          },
          {
            id: 2,
            option_text: "Listen first and ask thoughtful questions",
            score_value: 1,
            trait_category: "introverted",
          },
          {
            id: 3,
            option_text: "Find common ground through shared experiences",
            score_value: 2,
            trait_category: "balanced",
          },
          {
            id: 4,
            option_text: "Keep interactions brief and professional",
            score_value: 0,
            trait_category: "reserved",
          },
        ],
      },
      {
        id: 2,
        question_text: "In group discussions, I typically:",
        options: [
          {
            id: 5,
            option_text: "Take the lead and guide the conversation",
            score_value: 3,
            trait_category: "assertive",
          },
          {
            id: 6,
            option_text: "Contribute when I have something valuable to add",
            score_value: 2,
            trait_category: "selective",
          },
          {
            id: 7,
            option_text: "Prefer to listen and support others' ideas",
            score_value: 1,
            trait_category: "supportive",
          },
          {
            id: 8,
            option_text: "Feel more comfortable observing than participating",
            score_value: 0,
            trait_category: "observer",
          },
        ],
      },
      {
        id: 3,
        question_text: "When giving feedback, I tend to:",
        options: [
          { id: 9, option_text: "Be direct and straightforward", score_value: 3, trait_category: "direct" },
          {
            id: 10,
            option_text: "Focus on specific examples and solutions",
            score_value: 2,
            trait_category: "analytical",
          },
          { id: 11, option_text: "Emphasize positive aspects first", score_value: 1, trait_category: "diplomatic" },
          {
            id: 12,
            option_text: "Avoid giving feedback unless absolutely necessary",
            score_value: 0,
            trait_category: "avoidant",
          },
        ],
      },
      {
        id: 4,
        question_text: "My ideal conversation style is:",
        options: [
          { id: 13, option_text: "Fast-paced and energetic", score_value: 3, trait_category: "dynamic" },
          { id: 14, option_text: "Thoughtful and deep", score_value: 2, trait_category: "reflective" },
          { id: 15, option_text: "Warm and personal", score_value: 1, trait_category: "personal" },
          { id: 16, option_text: "Structured and focused", score_value: 0, trait_category: "formal" },
        ],
      },
    ],
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const quizId = Number.parseInt(params.id)

    // TODO: Replace with Supabase query when ready
    // const { data: quiz, error } = await supabase
    //   .from('personality_quizzes')
    //   .select(`
    //     *,
    //     quiz_questions (
    //       *,
    //       quiz_options (*)
    //     )
    //   `)
    //   .eq('id', quizId)
    //   .single()

    // if (error) throw error

    // For now, return mock data
    const quiz = mockQuizData[quizId as keyof typeof mockQuizData]

    if (!quiz) {
      return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: quiz,
    })
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch quiz" }, { status: 500 })
  }
}
