'use client';

import { useState } from 'react';
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useAuth } from '@/hooks/use-clerk-auth';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookHeart, Sparkles, Lightbulb, ArrowRight, Play } from 'lucide-react';
import JournalApp from '@/components/journal-app';
import { SoftIcon } from '@/components/soft-icon';

const pageBg = 'min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50';

export default function HomePage() {
  const [previewing, setPreviewing] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={`${pageBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Signed in: show the full app
  if (user) {
    return (
      <div className={pageBg}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <SoftIcon icon={BookHeart} />
              <span className="text-xl font-semibold text-sky-900">Reverie</span>
            </div>
            <UserButton />
          </div>
          <JournalApp />
        </div>
      </div>
    );
  }

  // Signed out, trying the demo
  if (previewing) {
    return (
      <div className={pageBg}>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white/80 border border-sky-100 rounded-3xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <SoftIcon icon={Play} size="sm" />
                <span className="text-sky-800 font-medium">Preview Mode</span>
                <Badge variant="secondary">Demo</Badge>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPreviewing(false)}>
                  Back
                </Button>
                <SignInButton mode="modal">
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.75} />
                    Sign in to Save
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>
          <JournalApp />
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div className={pageBg}>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <SoftIcon icon={BookHeart} size="lg" />
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-sky-900 mb-6">
            Welcome to <span className="text-sky-500">Reverie</span>
          </h1>
          <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
            Your peaceful space for reflection and self-discovery. Journal your thoughts,
            track your growth, and explore your inner world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                <Sparkles className="h-5 w-5 mr-2" strokeWidth={1.75} />
                Get Started
              </Button>
            </SignUpButton>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setPreviewing(true)}
              className="text-lg px-8 py-6"
            >
              <Play className="h-5 w-5 mr-2" strokeWidth={1.75} />
              Try Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Already have an account?{' '}
            <SignInButton mode="modal">
              <button className="text-sky-600 font-medium hover:underline">Sign in</button>
            </SignInButton>
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <SoftIcon icon={BookHeart} size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-2">Personal Journaling</CardTitle>
            <CardDescription>
              Write freely in your private space. No judgment, just pure reflection.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <SoftIcon icon={Lightbulb} size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-2">Self-Discovery</CardTitle>
            <CardDescription>
              Track patterns, insights, and growth over time with intelligent analysis.
            </CardDescription>
          </Card>

          <Card className="text-center p-6">
            <SoftIcon icon={Sparkles} size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-2">Smart Insights</CardTitle>
            <CardDescription>
              Get personalized insights and prompts to deepen your self-reflection.
            </CardDescription>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-sky-50 to-white">
            <CardTitle className="text-2xl mb-4">Ready to start your journey?</CardTitle>
            <CardDescription className="text-lg mb-6">
              Explore the demo or create an account to start saving your reflections and insights.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={() => setPreviewing(true)}>
                Explore Demo
                <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.75} />
              </Button>
              <SignUpButton mode="modal">
                <Button size="lg">
                  <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.75} />
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
