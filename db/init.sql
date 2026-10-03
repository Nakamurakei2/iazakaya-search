CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) NOT NULl UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites(
  user_id INTEGER NOT NULL,
  restaurant_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, restaurant_id),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS histories(
  history_id INTEGER GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL,
  restaurant_id VARCHAR(100) NOT NULL,
  memo VARCHAR(255),
  star VARCHAR(5),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(user_id, restaurant_id, history_id),
  FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- 現在の検索状況
CREATE TABLE IF NOT EXISTS ai_sessions (
  session_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  interaction_id VARCHAR(400) DEFAULT '',
  criteria JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- 会話履歴
CREATE TABLE IF NOT EXISTS ai_conversations (
  message_id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL,
  role VARCHAR(30) NOT NULL,
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(session_id)
    REFERENCES ai_sessions(session_id)
    ON DELETE CASCADE
)