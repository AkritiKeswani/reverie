"use client";

import { useState, useEffect } from "react";
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
import { BookHeart, Sparkles, Feather, CalendarHeart, Lightbulb, Mic } from "lucide-react";
import { SoftIcon } from "@/components/soft-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuizComponent from "@/components/quiz-component";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { JournalService } from "@/lib/journal-service";

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: string;
}


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
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { isSignedIn } = useUser();

  // Load saved entries from Supabase for signed-in users
  useEffect(() => {
    if (!isSignedIn) return;
    JournalService.getUserEntries()
      .then((entries) =>
        setRecentEntries(
          entries.map((entry) => ({
            id: entry.id,
            date: new Date(entry.created_at),
            content: entry.content,
            mood: entry.mood ?? "Free write",
          }))
        )
      )
      .catch((err) => {
        console.error("Error loading entries:", err);
        toast.error("Couldn't load your journal entries");
      });
  }, [isSignedIn]);
  
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    transcript,
    error
  } = useVoiceRecorder();

  // Auto-populate text area when transcription is complete
  useEffect(() => {
    if (transcript && !isTranscribing) {
      setCurrentEntry(prev => prev + (prev ? '\n\n' : '') + transcript);
      // Clear transcript after adding to entry
      setTimeout(() => {
        // This will trigger a re-render to clear the transcript display
      }, 100);
    }
  }, [transcript, isTranscribing]);

  const handlePromptSelect = (prompt: string) => {
    console.log('Prompt selected:', prompt); // Debug log
    setSelectedPrompt(prompt);
    setCurrentEntry(prompt + "\n\n");
    console.log('Current entry set to:', prompt + "\n\n"); // Debug log
  };

  const handleSaveEntry = async () => {
    if (!currentEntry.trim()) return;

    const mood = selectedPrompt ? "Prompted" : "Free write";
    let newEntry: JournalEntry;

    if (isSignedIn) {
      setIsSaving(true);
      try {
        const saved = await JournalService.createEntry({
          content: currentEntry,
          prompt_used: selectedPrompt || undefined,
          mood,
        });
        newEntry = {
          id: saved.id,
          date: new Date(saved.created_at),
          content: saved.content,
          mood: saved.mood ?? mood,
        };
      } catch (err) {
        console.error("Error saving entry:", err);
        toast.error("Couldn't save your entry. Please try again.");
        return;
      } finally {
        setIsSaving(false);
      }
    } else {
      // Demo mode: keep entries in memory only
      newEntry = {
        id: Math.random().toString(36).slice(2, 11),
        date: new Date(),
        content: currentEntry,
        mood,
      };
    }

    setRecentEntries(prev => [newEntry, ...prev]);
    setCurrentEntry("");
    setSelectedPrompt("");
  };

  const handleStartQuiz = (quizId: number) => {
    console.log('Starting quiz with ID:', quizId);
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
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 p-4">
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-sky-900 mb-2">Reverie</h1>
          <p className="text-slate-500">
            Your peaceful space for reflection and self-discovery
          </p>
        </header>

        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookHeart className="w-4 h-4" strokeWidth={1.75} />
              Journal
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
              Personality Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Writing Area */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <SoftIcon icon={Feather} />
                      New Entry
                      <Button
                        variant="outline"
                        size="sm"
                        className={`ml-auto px-3 py-2 h-8 transition-colors ${
                          isRecording 
                            ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800' 
                            : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700 hover:text-sky-800'
                        }`}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isTranscribing}
                        title={isRecording 
                          ? "Click to stop recording" 
                          : "Click to record voice note - it will automatically appear in your journal entry"
                        }
                      >
                        <Mic strokeWidth={1.75} className={`h-4 w-4 mr-1 ${isRecording ? 'animate-pulse' : ''}`} />
                        {isRecording ? 'Stop' : isTranscribing ? 'Transcribing...' : 'Record'}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {selectedPrompt
                        ? "Writing from prompt"
                        : "What's on your mind today?"}
                      {selectedPrompt && (
                        <div className="mt-2 text-xs text-gray-500">
                          Debug: Selected prompt: "{selectedPrompt}"
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPrompt && (
                      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                        <p className="text-sm text-sky-800 font-medium">
                          Prompt:
                        </p>
                        <p className="text-sky-700">{selectedPrompt}</p>
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
                    {/* Voice recording status and errors */}
                    {(isRecording || isTranscribing || error || transcript) && (
                      <div className="p-3 border rounded-2xl bg-sky-50/50">
                        {isRecording && (
                          <div className="flex items-center text-blue-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm">Recording... Speak now!</span>
                          </div>
                        )}
                        {isTranscribing && (
                          <div className="flex items-center text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-sm">Transcribing your voice...</span>
                          </div>
                        )}
                        {transcript && !isTranscribing && (
                          <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Transcription complete! Added to your entry.</span>
                          </div>
                        )}
                        {error && (
                          <div className="text-red-600 text-sm">
                            <span className="font-medium">Error:</span> {error}
                            {error.includes('Microphone access denied') && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                                <p className="font-medium mb-1">How to fix:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                  <li>Click the microphone icon in your browser's address bar</li>
                                  <li>Select "Allow" for microphone access</li>
                                  <li>Refresh the page and try again</li>
                                </ol>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p>{currentEntry.length} characters</p>
                        {isRecording && (
                          <p className="text-xs text-red-600">Recording in progress...</p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {isRecording && (
                          <Button
                            onClick={stopRecording}
                            variant="destructive"
                            size="sm"
                          >
                            Stop Recording
                          </Button>
                        )}
                        <Button
                          onClick={handleSaveEntry}
                          disabled={!currentEntry.trim() || isSaving}
                        >
                          {isSaving ? "Saving..." : "Save Entry"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Prompt Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <SoftIcon icon={Lightbulb} />
                      Writing Prompts
                    </CardTitle>
                    <CardDescription>
                      Get inspired with these thoughtful prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {journalPrompts.map((prompt, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-2xl cursor-pointer transition-colors ${
                            selectedPrompt === prompt 
                              ? "bg-sky-100 text-sky-900 border-sky-200" 
                              : "bg-white hover:bg-sky-50 border-sky-100"
                          }`}
                          onClick={() => {
                            console.log('Prompt clicked:', prompt);
                            handlePromptSelect(prompt);
                          }}
                        >
                          <p className="text-sm leading-relaxed break-words">{prompt}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Entries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <SoftIcon icon={CalendarHeart} />
                      Recent Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentEntries.length > 0 ? (
                      <div className="space-y-3">
                        {recentEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="p-3 border rounded-2xl hover:bg-sky-50 cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium">
                                {entry.date instanceof Date 
                                  ? entry.date.toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })
                                  : new Date(entry.date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })
                                }
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {entry.mood}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {entry.content.length > 100 
                                ? entry.content.substring(0, 100) + '...' 
                                : entry.content
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No entries yet. Start writing to see them here!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-2">
                Personality Assessments
              </h2>
              <p className="text-gray-600">
                Explore different aspects of your personality and gain deeper
                self-understanding
              </p>
              <div className="mt-4 p-2 bg-sky-50 rounded-full text-xs">
                Debug: {personalityQuizzes.length} quizzes available
              </div>
            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalityQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-lg hover:shadow-sky-100 hover:-translate-y-0.5 transition-all"
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
                        className="p-6 border rounded-3xl bg-gradient-to-br from-sky-50 to-white"
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
                                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-2 flex-shrink-0"></span>
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
                                className="p-4 border rounded-2xl bg-white"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
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
                                      className={`flex-1 h-2 rounded-full ${
                                        segment <= dimension.percentage / 20
                                          ? "bg-sky-400"
                                          : "bg-sky-100"
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
                    <SoftIcon icon={Sparkles} size="lg" className="mx-auto mb-4" />
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
