-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    age INT,
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50),
    postpartum_start_date DATE,
    doctor_name VARCHAR(50),
    doctor_email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    token VARCHAR(512) NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    is_bot BOOLEAN NOT NULL DEFAULT FALSE,
    message_text TEXT NOT NULL,
    translated_text TEXT,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sentiment scores table
CREATE TABLE IF NOT EXISTS sentiment_scores (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    chat_message_id INT REFERENCES chat_messages(id),
    score NUMERIC(3,1) NOT NULL,
    label VARCHAR(50),
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);