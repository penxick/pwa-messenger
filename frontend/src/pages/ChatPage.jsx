import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChatMessages, sendMessage } from "../api/api";

function ChatPage() {
  const { chatId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const intervalRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();

    intervalRef.current = setInterval(() => {
      loadMessages(true);
    }, 700);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadMessages(silent = false) {
    try {
      const data = await getChatMessages(chatId);
      setMessages(data);

      if (!silent) {
        setError("");
      }
    } catch (err) {
      if (!silent) {
        setError(err.message);
      }
    }
  }

  async function handleSend() {
    if (!text.trim()) return;

    try {
      await sendMessage({
        chatId: Number(chatId),
        senderId: user.id,
        text: text.trim(),
      });

      setText("");
      await loadMessages(true);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
        {messages.length === 0 ? (
          <div style={{ opacity: 0.7, textAlign: "center", marginTop: 20 }}>
            Сообщений пока нет
          </div>
        ) : (
          messages.map((message) => {
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
                <div style={{ fontSize: 12, marginBottom: 6, opacity: 0.75 }}>
                  {message.sender.username} ({message.sender.publicId})
                </div>

                <div>{message.text}</div>

                <div style={{ fontSize: 11, marginTop: 8, opacity: 0.6 }}>
                  {formatDate(message.createdAt)}
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
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

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const messagesBoxStyle = {
  marginTop: 16,
  background: "#eef2ff",
  borderRadius: 16,
  padding: 16,
  minHeight: 400,
  maxHeight: "65vh",
  overflowY: "auto",
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