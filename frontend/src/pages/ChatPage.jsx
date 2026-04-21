import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChatMessages, sendMessage } from "../api/api";

function ChatPage() {
  const { chatId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  async function loadMessages() {
    try {
      const data = await getChatMessages(chatId);
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSend() {
    if (!text.trim()) return;

    try {
      await sendMessage({
        chatId: Number(chatId),
        senderId: user.id,
        text,
      });

      setText("");
      loadMessages();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/chats">← Назад к чатам</Link>
      </div>

      <h2>Чат #{chatId}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={messagesBoxStyle}>
        {messages.map((message) => {
          const isMine = message.sender.id === user.id;

          return (
            <div
              key={message.id}
              style={{
                ...messageStyle,
                alignSelf: isMine ? "flex-end" : "flex-start",
                background: isMine ? "#dbeafe" : "#fff",
              }}
            >
              <div style={{ fontSize: 12, marginBottom: 6 }}>
                {message.sender.username} ({message.sender.publicId})
              </div>
              <div>{message.text}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={handleSend} style={buttonStyle}>
          Отправить
        </button>
      </div>
    </div>
  );
}

const messagesBoxStyle = {
  marginTop: 16,
  background: "#eef2ff",
  borderRadius: 16,
  padding: 16,
  minHeight: 400,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const messageStyle = {
  maxWidth: "70%",
  padding: 12,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
};

export default ChatPage;