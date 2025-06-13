from app.core.database import get_db_connection

def save_user_message(user_id, message, sentiment_score):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        "INSERT INTO user_history (user_id, message, sentiment_score) VALUES (?, ?, ?)",
        (user_id, message, sentiment_score)
    )
    conn.commit()
    conn.close()

def get_user_history(user_id, limit=10):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        "SELECT message, sentiment_score, timestamp FROM user_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
        (user_id, limit)
    )
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
