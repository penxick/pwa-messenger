import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findUserByPublicId, getUserChats, openPrivateChat } from "../api/api";

function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [searchPublicId, setSearchPublicId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadChats();

    intervalRef.current = setInterval(() => {
      loadChats(true);
    }, 2500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  async function loadChats(silent = false) {
    try {
      const data = await getUserChats(user.id);
      setChats(data);

      if (!silent) {
        setError("");
      }
    } catch (err) {
      if (!silent) {
        setError(err.message);
      }
    }
  }

  async function handleSearchAndOpen() {
    setError("");

    try {
      const foundUser = await findUserByPublicId(searchPublicId.trim());

      const chat = await openPrivateChat({
        currentUserId: user.id,
        targetUserPublicId: foundUser.publicId,
      });

      await loadChats(true);
      navigate(`/chats/${chat.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Мои чаты</h2>
          <p style={{ margin: "8px 0 0 0" }}>
            {user?.username} ({user?.publicId})
          </p>
        </div>

        <button onClick={handleLogout} style={buttonStyle}>
          Выйти
        </button>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Найти пользователя по publicId</h3>

        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={searchPublicId}
            onChange={(e) => setSearchPublicId(e.target.value)}
            placeholder="Введите publicId"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={handleSearchAndOpen} style={buttonStyle}>
            Открыть чат
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {chats.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ margin: 0 }}>У вас пока нет чатов</p>
            <p style={{ marginTop: 8, opacity: 0.7 }}>Начните общение</p>
          </div>
        ) : (
          chats.map((chat) => (
            <Link key={chat.chatId} to={`/chats/${chat.chatId}`} style={chatCardStyle}>
              <strong>{chat.otherUser?.username}</strong>
              <div style={{ marginTop: 6 }}>{chat.otherUser?.publicId}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};

const chatCardStyle = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const emptyStyle = {
  background: "#fff",
  padding: 24,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  textAlign: "center",
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

export default ChatsPage;