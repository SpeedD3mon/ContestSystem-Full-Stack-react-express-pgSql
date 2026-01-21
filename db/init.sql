-- ==========================
-- DROP EXISTING OBJECTS (safe to re-run)
-- ==========================
DROP DATABASE IF EXISTS contest_system;

-- Create the database
CREATE DATABASE contest_system;

\c contest_system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================
-- USERS TABLE
-- ==========================
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'vip', 'signed-in')),
    refresh_token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ==========================
-- CONTESTS TABLE
-- ==========================
DROP TABLE IF EXISTS contests CASCADE;
CREATE TABLE contests (
    contest_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('vip', 'normal')),
    prize TEXT,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    prizes_processed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ==========================
-- QUESTIONS TABLE
-- ==========================
DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    contest_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (
        question_type IN ('single-select', 'multi-select', 'true-false')
    ),
    points INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE
);

-- ==========================
-- OPTIONS TABLE
-- ==========================
DROP TABLE IF EXISTS options CASCADE;
CREATE TABLE options (
    option_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- ==========================
-- USER CONTEST ATTEMPTS
-- ==========================
DROP TABLE IF EXISTS user_contest_attempts CASCADE;
CREATE TABLE user_contest_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    contest_id INT NOT NULL,
    score INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE
);

-- ==========================
-- USER ANSWERS
-- ==========================
DROP TABLE IF EXISTS user_answers CASCADE;
CREATE TABLE user_answers (
    answer_id SERIAL PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_options JSONB NOT NULL,
    is_correct BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (attempt_id) REFERENCES user_contest_attempts(attempt_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- ==========================
-- PRIZES
-- ==========================
DROP TABLE IF EXISTS prizes CASCADE;
CREATE TABLE prizes (
    prize_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    contest_id INT NOT NULL,
    prize TEXT NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE
);

-- ==========================
-- INDEXES (safe)
-- ==========================
DROP INDEX IF EXISTS idx_attempt_user;
DROP INDEX IF EXISTS idx_attempt_contest;
DROP INDEX IF EXISTS idx_answers_attempt;
DROP INDEX IF EXISTS idx_questions_contest;

CREATE INDEX idx_attempt_user ON user_contest_attempts(user_id);
CREATE INDEX idx_attempt_contest ON user_contest_attempts(contest_id);
CREATE INDEX idx_answers_attempt ON user_answers(attempt_id);
CREATE INDEX idx_questions_contest ON questions(contest_id);
CREATE INDEX idx_users_refresh_token ON users(refresh_token);
-- ==========================
-- SAMPLE DATA
-- ==========================
-- Users
INSERT INTO users (username, email, password, role)
VALUES
('admin', 'admin@example.com', 'hashed_password_1', 'admin'),
('vip_user', 'vip@example.com', 'hashed_password_2', 'vip'),
('normal_user', 'normal@example.com', 'hashed_password_3', 'signed-in');

-- Contests
INSERT INTO contests (name, description, access_level, prize, starts_at, ends_at, is_active)
VALUES
(
  'Normal General Knowledge Quiz',
  'Test your general knowledge!',
  'normal',
  '1000 PKR Gift Card',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '23 hours',
  TRUE
),
(
  'VIP Coding Challenge',
  'A coding challenge for VIP users only.',
  'vip',
  'Laptop',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '2 days',
  FALSE
),
(
  'Normal Coding Challenge',
  'A coding challenge for VIP users only.',
  'normal',
  '4000',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '2 days',
  FALSE
);

-- Questions (Contest 1)
INSERT INTO questions (contest_id, question_text, question_type, points)
VALUES
(1, 'What is the capital of Pakistan?', 'single-select', 1),
(1, 'Which of the following are programming languages?', 'multi-select', 2),
(1, 'PostgreSQL is a relational database.', 'true-false', 1),
(1, 'Which planet is known as the Red Planet?', 'single-select', 1),
(1, 'Select all backend languages:', 'multi-select', 2),
(1, 'Node.js is built on Chrome V8 engine.', 'true-false', 1);

-- Questions (Contest 2)
INSERT INTO questions (contest_id, question_text, question_type, points)
VALUES
(2, 'Which keyword is used in JS to declare a constant?', 'single-select', 1),
(2, 'Select valid backend frameworks:', 'multi-select', 2),
(2, 'Node.js is single-threaded.', 'true-false', 1);

-- Questions (Contest 3)
INSERT INTO questions (contest_id, question_text, question_type, points)
VALUES
(3, 'What is the capital of Pakistan?', 'single-select', 1),
(3, 'Which of the following are programming languages?', 'multi-select', 2),
(3, 'PostgreSQL is a relational database.', 'true-false', 1),
(3, 'Which planet is known as the Red Planet?', 'single-select', 1),
(3, 'Select all backend languages:', 'multi-select', 2),
(3, 'Node.js is built on Chrome V8 engine.', 'true-false', 1);
-- Options
INSERT INTO options (question_id, option_text, is_correct)
VALUES
-- Contest 1
(1, 'Lahore', FALSE),
(1, 'Karachi', FALSE),
(1, 'Islamabad', TRUE),
(1, 'Peshawar', FALSE),

(2, 'Python', TRUE),
(2, 'HTML', FALSE),
(2, 'JavaScript', TRUE),
(2, 'CSS', FALSE),

(3, 'True', TRUE),
(3, 'False', FALSE),

(4, 'Earth', FALSE),
(4, 'Mars', TRUE),
(4, 'Jupiter', FALSE),
(4, 'Venus', FALSE),

(5, 'PHP', TRUE),
(5, 'Python', TRUE),
(5, 'HTML', FALSE),
(5, 'CSS', FALSE),

(6, 'True', TRUE),
(6, 'False', FALSE),

-- Contest 2
(7, 'const', TRUE),
(7, 'var', FALSE),
(7, 'let', FALSE),

(8, 'Express', TRUE),
(8, 'Laravel', TRUE),
(8, 'React', FALSE),

(9, 'True', TRUE),
(9, 'False', FALSE),
-- Contest 3
(10, 'Lahore', FALSE),
(10, 'Karachi', FALSE),
(10, 'Islamabad', TRUE),
(10, 'Peshawar', FALSE),

(11, 'Python', TRUE),
(11, 'HTML', FALSE),
(11, 'JavaScript', TRUE),
(11, 'CSS', FALSE),

(12, 'True', TRUE),
(12, 'False', FALSE),

(13, 'Earth', FALSE),
(13, 'Mars', TRUE),
(13, 'Jupiter', FALSE),
(13, 'Venus', FALSE),

(14, 'PHP', TRUE),
(14, 'Python', TRUE),
(14, 'HTML', FALSE),
(14, 'CSS', FALSE),

(15, 'True', TRUE),
(15, 'False', FALSE);

-- Sample Attempts
INSERT INTO user_contest_attempts (user_id, contest_id, score, is_completed)
VALUES
(2, 1, 4, TRUE),
(3, 1, 3, TRUE);

-- Sample Answers
INSERT INTO user_answers (attempt_id, question_id, selected_options, is_correct)
VALUES
(1, 1, '[3]', TRUE),
(1, 2, '[1,3]', TRUE),
(1, 3, '[1]', TRUE),
(2, 1, '[1]', FALSE),
(2, 2, '[1,2]', FALSE),
(2, 3, '[1]', TRUE);

-- Sample Prizes
INSERT INTO prizes (user_id, contest_id, prize)
VALUES
(2, 1, '1000 PKR Gift Card');
