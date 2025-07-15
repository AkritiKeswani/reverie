import { NextResponse } from "next/server";
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
    title: "Interaction Styles",
    description: "Discover how you interact with others and engage with tasks",
    category: "Social",
    questions: [
      {
        id: 1,
        question_text: "I make lots of noise.",
        options: [
          {
            id: 1,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "extroversion",
          },
          {
            id: 2,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "extroversion",
          },
          {
            id: 3,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "extroversion",
          },
          {
            id: 4,
            option_text: "Agree",
            score_value: 4,
            trait_category: "extroversion",
          },
          {
            id: 5,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "extroversion",
          },
        ],
      },
      {
        id: 2,
        question_text: "I hesitate to criticize other people's ideas.",
        options: [
          {
            id: 6,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "agreeableness",
          },
          {
            id: 7,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "agreeableness",
          },
          {
            id: 8,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "agreeableness",
          },
          {
            id: 9,
            option_text: "Agree",
            score_value: 4,
            trait_category: "agreeableness",
          },
          {
            id: 10,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "agreeableness",
          },
        ],
      },
      {
        id: 3,
        question_text: "I am emotionally reserved.",
        options: [
          {
            id: 11,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "emotional_stability",
          },
          {
            id: 12,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "emotional_stability",
          },
          {
            id: 13,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "emotional_stability",
          },
          {
            id: 14,
            option_text: "Agree",
            score_value: 4,
            trait_category: "emotional_stability",
          },
          {
            id: 15,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "emotional_stability",
          },
        ],
      },
      {
        id: 4,
        question_text: "I try to outdo others.",
        options: [
          {
            id: 16,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "competitiveness",
          },
          {
            id: 17,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "competitiveness",
          },
          {
            id: 18,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "competitiveness",
          },
          {
            id: 19,
            option_text: "Agree",
            score_value: 4,
            trait_category: "competitiveness",
          },
          {
            id: 20,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "competitiveness",
          },
        ],
      },
      {
        id: 5,
        question_text: "I read the fine print.",
        options: [
          {
            id: 21,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "conscientiousness",
          },
          {
            id: 22,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "conscientiousness",
          },
          {
            id: 23,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "conscientiousness",
          },
          {
            id: 24,
            option_text: "Agree",
            score_value: 4,
            trait_category: "conscientiousness",
          },
          {
            id: 25,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "conscientiousness",
          },
        ],
      },
      {
        id: 6,
        question_text: "I am always on the lookout for ways to improve.",
        options: [
          {
            id: 26,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "growth_mindset",
          },
          {
            id: 27,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "growth_mindset",
          },
          {
            id: 28,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "growth_mindset",
          },
          {
            id: 29,
            option_text: "Agree",
            score_value: 4,
            trait_category: "growth_mindset",
          },
          {
            id: 30,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "growth_mindset",
          },
        ],
      },
      {
        id: 7,
        question_text: "I prefer to work alone.",
        options: [
          {
            id: 31,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "introversion",
          },
          {
            id: 32,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "introversion",
          },
          {
            id: 33,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "introversion",
          },
          {
            id: 34,
            option_text: "Agree",
            score_value: 4,
            trait_category: "introversion",
          },
          {
            id: 35,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "introversion",
          },
        ],
      },
      {
        id: 8,
        question_text: "I enjoy being the center of attention.",
        options: [
          {
            id: 36,
            option_text: "Strongly Disagree",
            score_value: 1,
            trait_category: "extroversion",
          },
          {
            id: 37,
            option_text: "Disagree",
            score_value: 2,
            trait_category: "extroversion",
          },
          {
            id: 38,
            option_text: "Neutral",
            score_value: 3,
            trait_category: "extroversion",
          },
          {
            id: 39,
            option_text: "Agree",
            score_value: 4,
            trait_category: "extroversion",
          },
          {
            id: 40,
            option_text: "Strongly Agree",
            score_value: 5,
            trait_category: "extroversion",
          },
        ],
      },
    ],
    dimensions: [
      {
        name: "Extroversion",
        description: "How you engage with others and external stimuli",
        color: "blue",
        max_score: 10,
      },
      {
        name: "Agreeableness",
        description: "Your approach to cooperation and harmony",
        color: "green",
        max_score: 10,
      },
      {
        name: "Emotional Stability",
        description: "How you handle stress and emotional challenges",
        color: "purple",
        max_score: 10,
      },
      {
        name: "Competitiveness",
        description: "Your drive to achieve and outperform",
        color: "orange",
        max_score: 10,
      },
      {
        name: "Conscientiousness",
        description: "Your attention to detail and organization",
        color: "yellow",
        max_score: 10,
      },
      {
        name: "Growth Mindset",
        description: "Your openness to learning and improvement",
        color: "pink",
        max_score: 10,
      },
    ],
  },
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number.parseInt(params.id);

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
    const quiz = mockQuizData[quizId as keyof typeof mockQuizData];

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
