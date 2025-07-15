import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Uncomment when you're ready to connect to Supabase:
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface QuizSubmission {
  answers: Record<string, number>
  userId?: string
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const quizId = Number.parseInt(params.id)
    const body: QuizSubmission = await request.json()

    // Calculate scores based on answers
    const scores = calculateQuizScores(body.answers, quizId)
    const result = generateQuizResult(scores, quizId)

    // Save to Supabase when ready
    const { data: savedResult, error } = await supabase
      .from("user_quiz_results")
      .insert({
        user_id: body.userId || "anonymous",
        quiz_id: quizId,
        answers: body.answers,
        scores: scores,
        result_summary: result.summary,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // For now, just return the calculated result
    console.log("Quiz submitted:", { quizId, answers: body.answers, scores, result })

    return NextResponse.json({
      success: true,
      data: {
        scores,
        result,
        completedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ success: false, error: "Failed to submit quiz" }, { status: 500 })
  }
}

function calculateQuizScores(answers: Record<string, number>, quizId: number) {
  // This scoring system will work with your Supabase data structure
  if (quizId === 1) {
    // Communication Style Assessment scoring
    const traits = {
      extroverted: 0,
      assertive: 0,
      direct: 0,
      dynamic: 0,
    }

    // Calculate scores based on trait categories
    Object.values(answers).forEach((score) => {
      if (score >= 2) traits.extroverted += score
      if (score >= 1) traits.assertive += score
      if (score === 3) traits.direct += score
      if (score >= 2) traits.dynamic += score
    })

    return traits
  }

  return {}
}

function generateQuizResult(scores: any, quizId: number) {
  if (quizId === 1) {
    // Generate communication style result
    const totalScore = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0)

    if (totalScore >= 8) {
      return {
        type: "Dynamic Communicator",
        summary:
          "You're an energetic and direct communicator who enjoys engaging with others and leading conversations.",
        traits: ["Extroverted", "Assertive", "Direct", "Engaging"],
        recommendations: [
          "Practice active listening to balance your natural speaking tendency",
          "Be mindful of others who may need more time to process",
          "Use your communication skills to mentor others",
        ],
      }
    } else if (totalScore >= 4) {
      return {
        type: "Balanced Communicator",
        summary: "You adapt your communication style based on the situation and people involved.",
        traits: ["Flexible", "Thoughtful", "Diplomatic", "Adaptive"],
        recommendations: [
          "Continue developing your ability to read social situations",
          "Practice being more assertive when needed",
          "Use your balanced approach to facilitate group discussions",
        ],
      }
    } else {
      return {
        type: "Thoughtful Communicator",
        summary: "You prefer to listen, reflect, and communicate with intention and care.",
        traits: ["Reflective", "Empathetic", "Careful", "Supportive"],
        recommendations: [
          "Practice speaking up more in group settings",
          "Share your thoughtful insights more frequently",
          "Use your listening skills to build deeper connections",
        ],
      }
    }
  }

  return {
    type: "Quiz Complete",
    summary: "Thank you for completing the quiz!",
    traits: [],
    recommendations: [],
  }
}
