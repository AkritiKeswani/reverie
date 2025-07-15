"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface QuizOption {
  id: number
  option_text: string
  score_value: number
  trait_category: string
}

interface QuizQuestion {
  id: number
  question_text: string
  options: QuizOption[]
}

interface Quiz {
  id: number
  title: string
  description: string
  category: string
  questions: QuizQuestion[]
}

interface QuizResult {
  type: string
  summary: string
  traits: string[]
  recommendations: string[]
}

interface QuizComponentProps {
  quizId: number
  onComplete: (result: any) => void
  onBack: () => void
}

export default function QuizComponent({ quizId, onComplete, onBack }: QuizComponentProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`)
      const data = await response.json()

      if (data.success) {
        setQuiz(data.data)
      }
    } catch (error) {
      console.error("Error fetching quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, optionId: number, scoreValue: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: scoreValue,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          userId: "anonymous", // You'd get this from auth
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data.result)
        onComplete(data.data)
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading quiz...</p>
        </CardContent>
      </Card>
    )
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Quiz not found</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (result) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">{result.type}</CardTitle>
          <CardDescription className="text-base">{result.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Your Key Traits:</h3>
            <div className="flex flex-wrap gap-2">
              {result.traits.map((trait, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Recommendations:</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={onBack} className="w-full">
            Back to Quizzes
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const canProceed = answers[currentQ.id] !== undefined

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-xl">{quiz.title}</CardTitle>
        <CardDescription>{currentQ.question_text}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={answers[currentQ.id]?.toString() || ""}
          onValueChange={(value) => {
            const option = currentQ.options.find((opt) => opt.score_value.toString() === value)
            if (option) {
              handleAnswerSelect(currentQ.id, option.id, option.score_value)
            }
          }}
        >
          {currentQ.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.score_value.toString()} id={option.id.toString()} />
              <Label htmlFor={option.id.toString()} className="flex-1 cursor-pointer">
                {option.option_text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!canProceed || submitting}>
              {submitting ? "Submitting..." : "Complete Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
