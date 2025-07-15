-- Create tables for personality quizzes
CREATE TABLE IF NOT EXISTS personality_quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  questions_count INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES personality_quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_order INTEGER,
  question_type VARCHAR(50) DEFAULT 'multiple_choice'
);

CREATE TABLE IF NOT EXISTS quiz_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER,
  score_value INTEGER DEFAULT 0,
  trait_category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user_quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255), -- For now, we'll use a simple string ID
  quiz_id INTEGER REFERENCES personality_quizzes(id),
  answers JSONB,
  scores JSONB,
  result_summary TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_results_user_id ON user_quiz_results(user_id);
