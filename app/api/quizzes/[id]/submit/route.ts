import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uncomment when you're ready to connect to Supabase:
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QuizSubmission {
  answers: Record<string, number>;
  userId?: string;
}

interface PersonalityDimension {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
  color: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = Number.parseInt(params.id);
    const body: QuizSubmission = await request.json();

    // Calculate personality dimensions based on answers
    const dimensions = calculatePersonalityDimensions(body.answers, quizId);
    const result = generatePersonalityProfile(dimensions, quizId);

    // Save to Supabase when ready
    const { data: savedResult, error } = await supabase
      .from("user_quiz_results")
      .insert({
        user_id: body.userId || "anonymous",
        quiz_id: quizId,
        answers: body.answers,
        dimensions: dimensions,
        result_summary: result.summary,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // For now, just return the calculated result
    console.log("Quiz submitted:", {
      quizId,
      answers: body.answers,
      dimensions,
      result,
    });

    return NextResponse.json({
      success: true,
      data: {
        dimensions,
        result,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}

function calculatePersonalityDimensions(
  answers: Record<string, number>,
  quizId: number
): PersonalityDimension[] {
  if (quizId === 1) {
    // Interaction Styles quiz scoring
    const dimensionScores: Record<string, number> = {
      extroversion: 0,
      agreeableness: 0,
      emotional_stability: 0,
      competitiveness: 0,
      conscientiousness: 0,
      growth_mindset: 0,
      introversion: 0,
    };

    // Map question IDs to their trait categories and calculate scores
    const questionTraitMap: Record<string, string> = {
      "1": "extroversion", // I make lots of noise
      "2": "agreeableness", // I hesitate to criticize other people's ideas
      "3": "emotional_stability", // I am emotionally reserved
      "4": "competitiveness", // I try to outdo others
      "5": "conscientiousness", // I read the fine print
      "6": "growth_mindset", // I am always on the lookout for ways to improve
      "7": "introversion", // I prefer to work alone
      "8": "extroversion", // I enjoy being the center of attention
    };

    // Calculate scores for each dimension
    Object.entries(answers).forEach(([questionId, score]) => {
      const trait = questionTraitMap[questionId];
      if (trait) {
        dimensionScores[trait] += score;
      }
    });

    // Convert to PersonalityDimension objects
    const dimensions: PersonalityDimension[] = [
      {
        name: "Extroversion",
        score: dimensionScores.extroversion,
        maxScore: 10,
        percentage: (dimensionScores.extroversion / 10) * 100,
        description: "How you engage with others and external stimuli",
        color: "blue",
      },
      {
        name: "Agreeableness",
        score: dimensionScores.agreeableness,
        maxScore: 5,
        percentage: (dimensionScores.agreeableness / 5) * 100,
        description: "Your approach to cooperation and harmony",
        color: "green",
      },
      {
        name: "Emotional Stability",
        score: dimensionScores.emotional_stability,
        maxScore: 5,
        percentage: (dimensionScores.emotional_stability / 5) * 100,
        description: "How you handle stress and emotional challenges",
        color: "purple",
      },
      {
        name: "Competitiveness",
        score: dimensionScores.competitiveness,
        maxScore: 5,
        percentage: (dimensionScores.competitiveness / 5) * 100,
        description: "Your drive to achieve and outperform",
        color: "orange",
      },
      {
        name: "Conscientiousness",
        score: dimensionScores.conscientiousness,
        maxScore: 5,
        percentage: (dimensionScores.conscientiousness / 5) * 100,
        description: "Your attention to detail and organization",
        color: "yellow",
      },
      {
        name: "Growth Mindset",
        score: dimensionScores.growth_mindset,
        maxScore: 5,
        percentage: (dimensionScores.growth_mindset / 5) * 100,
        description: "Your openness to learning and improvement",
        color: "pink",
      },
      {
        name: "Introversion",
        score: dimensionScores.introversion,
        maxScore: 5,
        percentage: (dimensionScores.introversion / 5) * 100,
        description: "Your preference for solitude and reflection",
        color: "indigo",
      },
    ];

    return dimensions;
  }

  return [];
}

function generatePersonalityProfile(
  dimensions: PersonalityDimension[],
  quizId: number
) {
  if (quizId === 1) {
    // Find dominant traits
    const sortedDimensions = dimensions.sort(
      (a, b) => b.percentage - a.percentage
    );
    const dominantTrait = sortedDimensions[0];
    const secondaryTrait = sortedDimensions[1];

    // Generate personality type based on dominant traits
    let personalityType = "Balanced Individual";
    let summary =
      "You show a well-rounded personality with balanced traits across different dimensions.";

    if (dominantTrait.percentage > 70) {
      if (dominantTrait.name === "Extroversion") {
        personalityType = "The Energizer";
        summary =
          "You're naturally outgoing and thrive in social situations. Your energy is contagious and you love being around people.";
      } else if (dominantTrait.name === "Agreeableness") {
        personalityType = "The Harmonizer";
        summary =
          "You prioritize cooperation and harmony in your relationships. You're naturally empathetic and supportive of others.";
      } else if (dominantTrait.name === "Emotional Stability") {
        personalityType = "The Steady Anchor";
        summary =
          "You maintain emotional balance even in challenging situations. Others rely on your calm and composed nature.";
      } else if (dominantTrait.name === "Competitiveness") {
        personalityType = "The Achiever";
        summary =
          "You're driven by goals and love to excel. Your competitive spirit pushes you to constantly improve and succeed.";
      } else if (dominantTrait.name === "Conscientiousness") {
        personalityType = "The Organizer";
        summary =
          "You're detail-oriented and highly organized. Your reliability and thoroughness make you trustworthy.";
      } else if (dominantTrait.name === "Growth Mindset") {
        personalityType = "The Learner";
        summary =
          "You're always seeking to improve and grow. Your curiosity and adaptability help you thrive in changing environments.";
      } else if (dominantTrait.name === "Introversion") {
        personalityType = "The Reflector";
        summary =
          "You prefer deep, meaningful connections and need time to recharge. Your thoughtful nature brings unique insights.";
      }
    }

    // Generate insights based on trait combinations
    const insights = [];
    if (
      dimensions.find((d) => d.name === "Extroversion")?.percentage > 60 &&
      dimensions.find((d) => d.name === "Growth Mindset")?.percentage > 60
    ) {
      insights.push(
        "Your outgoing nature combined with a growth mindset makes you a natural leader and mentor."
      );
    }
    if (
      dimensions.find((d) => d.name === "Emotional Stability")?.percentage >
        60 &&
      dimensions.find((d) => d.name === "Agreeableness")?.percentage > 60
    ) {
      insights.push(
        "Your emotional stability and agreeableness make you a trusted confidant and mediator."
      );
    }
    if (
      dimensions.find((d) => d.name === "Competitiveness")?.percentage > 60 &&
      dimensions.find((d) => d.name === "Conscientiousness")?.percentage > 60
    ) {
      insights.push(
        "Your competitive drive combined with conscientiousness makes you highly effective in goal-oriented environments."
      );
    }

    return {
      type: personalityType,
      summary,
      traits: dimensions.map((d) => d.name),
      insights,
      recommendations: generateRecommendations(dimensions),
    };
  }

  return {
    type: "Quiz Complete",
    summary: "Thank you for completing the quiz!",
    traits: [],
    insights: [],
    recommendations: [],
  };
}

function generateRecommendations(dimensions: PersonalityDimension[]): string[] {
  const recommendations = [];

  dimensions.forEach((dimension) => {
    if (dimension.percentage < 40) {
      // Low score recommendations
      if (dimension.name === "Growth Mindset") {
        recommendations.push(
          "Consider setting small learning goals to develop your growth mindset."
        );
      } else if (dimension.name === "Emotional Stability") {
        recommendations.push(
          "Practice mindfulness or meditation to build emotional resilience."
        );
      } else if (dimension.name === "Conscientiousness") {
        recommendations.push(
          "Try using productivity tools to improve your organization skills."
        );
      }
    } else if (dimension.percentage > 80) {
      // High score recommendations
      if (dimension.name === "Extroversion") {
        recommendations.push(
          "Use your social energy to mentor others and build strong networks."
        );
      } else if (dimension.name === "Competitiveness") {
        recommendations.push(
          "Channel your competitive drive into collaborative achievements."
        );
      } else if (dimension.name === "Agreeableness") {
        recommendations.push(
          "Your natural empathy can help you excel in people-oriented roles."
        );
      }
    }
  });

  return recommendations;
}
