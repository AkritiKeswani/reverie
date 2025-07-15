-- Insert sample personality quizzes
INSERT INTO personality_quizzes (title, description, category, questions_count, duration_minutes) VALUES
('Communication Style Assessment', 'Discover how you prefer to communicate and connect with others', 'Social', 8, 5),
('Decision Making Patterns', 'Understand your approach to making choices and solving problems', 'Cognitive', 12, 7),
('Stress Response Profile', 'Learn how you naturally respond to stress and pressure', 'Emotional', 10, 6),
('Values & Motivation Explorer', 'Identify what truly drives and motivates you in life', 'Core Values', 15, 10);

-- Insert questions for Communication Style Assessment (quiz_id = 1)
INSERT INTO quiz_questions (quiz_id, question_text, question_order) VALUES
(1, 'When meeting new people, I prefer to:', 1),
(1, 'In group discussions, I typically:', 2),
(1, 'When giving feedback, I tend to:', 3),
(1, 'My ideal conversation style is:', 4),
(1, 'When someone disagrees with me, I:', 5),
(1, 'I feel most comfortable communicating:', 6),
(1, 'When explaining complex ideas, I:', 7),
(1, 'In conflict situations, I prefer to:', 8);

-- Insert options for Communication Style questions
-- Question 1: When meeting new people, I prefer to:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(1, 'Jump right into conversation and share about myself', 1, 3, 'extroverted'),
(1, 'Listen first and ask thoughtful questions', 2, 1, 'introverted'),
(1, 'Find common ground through shared experiences', 3, 2, 'balanced'),
(1, 'Keep interactions brief and professional', 4, 0, 'reserved');

-- Question 2: In group discussions, I typically:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(2, 'Take the lead and guide the conversation', 1, 3, 'assertive'),
(2, 'Contribute when I have something valuable to add', 2, 2, 'selective'),
(2, 'Prefer to listen and support others ideas', 3, 1, 'supportive'),
(2, 'Feel more comfortable observing than participating', 4, 0, 'observer');

-- Question 3: When giving feedback, I tend to:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(3, 'Be direct and straightforward', 1, 3, 'direct'),
(3, 'Focus on specific examples and solutions', 2, 2, 'analytical'),
(3, 'Emphasize positive aspects first', 3, 1, 'diplomatic'),
(3, 'Avoid giving feedback unless absolutely necessary', 4, 0, 'avoidant');

-- Question 4: My ideal conversation style is:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(4, 'Fast-paced and energetic', 1, 3, 'dynamic'),
(4, 'Thoughtful and deep', 2, 2, 'reflective'),
(4, 'Warm and personal', 3, 1, 'personal'),
(4, 'Structured and focused', 4, 0, 'formal');

-- Question 5: When someone disagrees with me, I:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(5, 'Enjoy the debate and defend my position', 1, 3, 'confrontational'),
(5, 'Try to understand their perspective', 2, 2, 'empathetic'),
(5, 'Look for compromise and middle ground', 3, 1, 'collaborative'),
(5, 'Prefer to avoid the conflict', 4, 0, 'conflict_avoidant');

-- Question 6: I feel most comfortable communicating:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(6, 'Face-to-face in person', 1, 3, 'in_person'),
(6, 'Through written messages or emails', 2, 1, 'written'),
(6, 'In small, intimate groups', 3, 2, 'small_group'),
(6, 'Through creative or visual means', 4, 0, 'creative');

-- Question 7: When explaining complex ideas, I:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(7, 'Use analogies and stories', 1, 2, 'narrative'),
(7, 'Break it down into logical steps', 2, 3, 'systematic'),
(7, 'Use visual aids or diagrams', 3, 1, 'visual'),
(7, 'Encourage questions and interaction', 4, 0, 'interactive');

-- Question 8: In conflict situations, I prefer to:
INSERT INTO quiz_options (question_id, option_text, option_order, score_value, trait_category) VALUES
(8, 'Address issues head-on immediately', 1, 3, 'immediate'),
(8, 'Take time to think before responding', 2, 2, 'thoughtful'),
(8, 'Seek mediation or outside help', 3, 1, 'collaborative'),
(8, 'Hope the issue resolves itself', 4, 0, 'passive');
