'use client';

import { useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Sparkles, ArrowRight, Play } from 'lucide-react';
import JournalApp from '@/components/journal-app';
import { UserProfile } from '@/components/user-profile';

export default function HomePage() {
  const [mode, setMode] = useState<'landing' | 'preview' | 'app'>('landing');
  const { user, signInWithGoogle, logout, loading } = useAuthContext();
  
  // Debug logging
  console.log('HomePage render:', { user: !!user, mode, loading });

  const handlePreview = () => {
    setMode('preview');
  };

  const handleSignIn = async () => {
    console.log('Starting Google sign in...');
    const result = await signInWithGoogle();
    console.log('Sign in result:', result);
    
    if (result.success) {
      console.log('Sign in successful, setting mode to app');
      setMode('app');
    } else if (result.error === 'Firebase: Error (auth/popup-closed-by-user)') {
      console.log('User closed the sign-in popup');
      // Don't show this as an error - it's just user canceling
    } else {
      console.error('Sign in failed:', result.error);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setMode('landing');
  };

  // If user is signed in and we're not in landing mode, show the full app
  if (user && mode !== 'landing' && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Reverie</h1>
            </div>
            <UserProfile />
          </div>
          <JournalApp />
        </div>
      </div>
    );
  }

  // If in preview mode, show the app with a preview banner
  if (mode === 'preview' && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Preview Mode</span>
                <Badge variant="outline" className="text-blue-700">Demo</Badge>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setMode('landing')}>
                  Back to Landing
                </Button>
                <Button onClick={handleSignIn} className="bg-blue-600 hover:bg-blue-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign in to Save
                </Button>
              </div>
            </div>
          </div>
          <JournalApp />
        </div>
      </div>
    );
  }

  // Show loading only when actively authenticating (not during demo)
  if (loading && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <BookOpen className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Reverie</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your peaceful space for reflection and self-discovery. Journal your thoughts, 
            track your growth, and explore your inner world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handlePreview}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleSignIn}
              className="text-lg px-8 py-6 border-2"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Sign in with Google
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="mb-2">Personal Journaling</CardTitle>
            <CardDescription>
              Write freely in your private space. No judgment, just pure reflection.
            </CardDescription>
          </Card>
          
          <Card className="text-center p-6">
            <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="mb-2">Self-Discovery</CardTitle>
            <CardDescription>
              Track patterns, insights, and growth over time with intelligent analysis.
            </CardDescription>
          </Card>
          
          <Card className="text-center p-6">
            <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="mb-2">Smart Insights</CardTitle>
            <CardDescription>
              Get personalized insights and prompts to deepen your self-reflection.
            </CardDescription>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardTitle className="text-2xl mb-4">Ready to start your journey?</CardTitle>
            <CardDescription className="text-lg mb-6">
              Choose to explore the demo or sign in to start saving your reflections and insights.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handlePreview}
                className="border-2"
              >
                Explore Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                onClick={handleSignIn}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
