import { pool } from "../pool";

type AiSessions = {
  userId: string;
  interaction?: string;
  criteria?: object;
};
/**
 * ai_sessionsテーブルに登録
 */
export const createAiSessions = async (props: AiSessions) => {
  const { userId } = props;
  try {
    const query = `
      INSERT INTO ai_sessions (user_id)
      VALUES ($1)
      RETURNING session_id
    `;
    const result = await pool.query(query, [userId]);
    const sessionId = result.rows[0].session_id;
    return sessionId;
  } catch (e: unknown) {
    console.error("e", e);
  }
};

export type AiConversation = {
  sessionId: string;
  role: "user" | "ai";
  content: string;
};

/**
 * ai_conversationsテーブルに登録
 */
export const createAiConversation = async (props: AiConversation) => {
  const { sessionId, role, content } = props;
  console.log("role", sessionId, role, content);
  try {
    const query = `
    INSERT INTO ai_conversations (session_id, role, content)
    VALUES ($1, $2, $3)
    
  `;
    const result = await pool.query(query, [sessionId, role, content]);
    console.log("reslt", result);
  } catch (e: unknown) {
    console.error("e", e);
  }
};

type UpdateAiSession = {
  interactionId: string;
  criteria: object;
  sessionId: number;
};
/**
 * ai_sessionテーブルにinteraction_idとcriteriaをupdate
 */
export const updateAiSession = async (props: UpdateAiSession) => {
  const { interactionId, criteria, sessionId } = props;
  const query = `
  UPDATE ai_sessions
  SET interaction_id = $1, criteria = $2
  WHERE session_id = $3
  `;

  try {
    const result = await pool.query(query, [
      interactionId,
      criteria,
      sessionId,
    ]);
    if (result.rowCount !== 1) {
      // error対応
    }
    return true;
  } catch (e: unknown) {
    console.error("e", e);
  }
};
