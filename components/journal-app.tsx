"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Plus, Calendar, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuizComponent from "@/components/quiz-component";

const journalPrompts = [
  "What made you smile today?",
  "Describe a moment when you felt truly present.",
  "What's something you're grateful for right now?",
  "How did you grow or learn something new today?",
  "What emotions did you experience today and why?",
  "What would you tell your past self from a year ago?",
  "Describe a challenge you overcame recently.",
  "What are three things that brought you joy this week?",
  "How do you want to feel tomorrow?",
  "What's something you're looking forward to?",
];

const personalityQuizzes = [
  {
    id: 1,
    title: "Interaction Styles",
    description: "Discover how you interact with others and engage with tasks",
    questions: 8,
    duration: "5 min",
    category: "Social",
  },
  {
    id: 2,
    title: "Decision Making Patterns",
    description:
      "Understand your approach to making choices and solving problems",
    questions: 12,
    duration: "7 min",
    category: "Cognitive",
  },
  {
    id: 3,
    title: "Stress Response Profile",
    description: "Learn how you naturally respond to stress and pressure",
    questions: 10,
    duration: "6 min",
    category: "Emotional",
  },
  {
    id: 4,
    title: "Values & Motivation Explorer",
    description: "Identify what truly drives and motivates you in life",
    questions: 15,
    duration: "10 min",
    category: "Core Values",
  },
];

const recentEntries = [
  {
    id: 1,
    date: "Today",
    preview: "Had an amazing conversation with a friend about...",
    mood: "Happy",
  },
  {
    id: 2,
    date: "Yesterday",
    preview: "Reflecting on the challenges I faced this week...",
    mood: "Thoughtful",
  },
  {
    id: 3,
    date: "2 days ago",
    preview: "Grateful for the small moments that made me smile...",
    mood: "Grateful",
  },
];

interface QuizResult {
  result: {
    type: string;
    summary: string;
    traits: string[];
    insights: string[];
  };
  dimensions: Array<{
    name: string;
    score: number;
    maxScore: number;
    percentage: number;
    description: string;
    color: string;
  }>;
}

export default function JournalApp() {
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setCurrentEntry(prompt + "\n\n");
  };

  const handleSaveEntry = () => {
    // TODO: Implement save functionality with Supabase
    console.log("Saving entry:", currentEntry);
    setCurrentEntry("");
    setSelectedPrompt("");
  };

  const handleStartQuiz = (quizId: number) => {
    setActiveQuiz(quizId);
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResults((prev: QuizResult[]) => [...prev, result]);
    setActiveQuiz(null);
  };

  const handleBackToQuizzes = () => {
    setActiveQuiz(null);
  };

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <QuizComponent
            quizId={activeQuiz}
            onComplete={handleQuizComplete}
            onBack={handleBackToQuizzes}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reverie</h1>
          <p className="text-gray-600">
            Your peaceful space for reflection and self-discovery
          </p>
        </header>

        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Personality Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Writing Area */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      New Entry
                    </CardTitle>
                    <CardDescription>
                      {selectedPrompt
                        ? "Writing from prompt"
                        : "What's on your mind today?"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPrompt && (
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800 font-medium">
                          Prompt:
                        </p>
                        <p className="text-blue-700">{selectedPrompt}</p>
                      </div>
                    )}
                    <Textarea
                      placeholder="Start writing your thoughts..."
                      value={currentEntry}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCurrentEntry(e.target.value)
                      }
                      className="min-h-[300px] resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {currentEntry.length} characters
                      </p>
                      <Button
                        onClick={handleSaveEntry}
                        disabled={!currentEntry.trim()}
                      >
                        Save Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Prompt Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Writing Prompts
                    </CardTitle>
                    <CardDescription>
                      Get inspired with these thoughtful prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {journalPrompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full text-left h-auto p-3 justify-start"
                            onClick={() => handlePromptSelect(prompt)}
                          >
                            <span className="text-sm">{prompt}</span>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Recent Entries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Recent Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">
                              {entry.date}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {entry.mood}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {entry.preview}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Personality Assessments
              </h2>
              <p className="text-gray-600">
                Explore different aspects of your personality and gain deeper
                self-understanding
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalityQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{quiz.category}</Badge>
                      <span className="text-sm text-gray-500">
                        {quiz.duration}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription className="text-base">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {quiz.questions} questions
                      </span>
                      <Button onClick={() => handleStartQuiz(quiz.id)}>
                        Start Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quiz Results Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Personality Insights</CardTitle>
                <CardDescription>
                  Complete quizzes to build your personality profile and track
                  your growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizResults.length > 0 ? (
                  <div className="space-y-6">
                    {quizResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50"
                      >
                        <div className="mb-6">
                          <h3 className="font-semibold text-xl mb-2">
                            {result.result.type}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {result.result.summary}
                          </p>

                          {result.result.insights &&
                            result.result.insights.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-medium text-sm text-gray-700 mb-2">
                                  Key Insights:
                                </h4>
                                <ul className="space-y-1">
                                  {result.result.insights.map(
                                    (insight, insightIndex) => (
                                      <li
                                        key={insightIndex}
                                        className="flex items-start gap-2 text-sm"
                                      >
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span className="text-gray-600">
                                          {insight}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>

                        {/* Personality Dimensions */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-4">
                            Your Personality Dimensions:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.dimensions.map((dimension, dimIndex) => (
                              <div
                                key={dimIndex}
                                className="p-4 border rounded-lg bg-white"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                      style={{
                                        backgroundColor:
                                          dimension.color === "blue"
                                            ? "#3B82F6"
                                            : dimension.color === "green"
                                            ? "#10B981"
                                            : dimension.color === "purple"
                                            ? "#8B5CF6"
                                            : dimension.color === "orange"
                                            ? "#F59E0B"
                                            : dimension.color === "yellow"
                                            ? "#EAB308"
                                            : dimension.color === "pink"
                                            ? "#EC4899"
                                            : dimension.color === "indigo"
                                            ? "#6366F1"
                                            : "#6B7280",
                                      }}
                                    >
                                      {dimension.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-sm">
                                      {dimension.name}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {Math.round(dimension.percentage)}%
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">
                                  {dimension.description}
                                </p>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((segment) => (
                                    <div
                                      key={segment}
                                      className={`flex-1 h-2 rounded ${
                                        segment <= dimension.percentage / 20
                                          ? "bg-gray-400"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Complete your first personality quiz to see insights here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
