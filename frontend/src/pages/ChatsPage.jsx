import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findUserByPublicId, getUserChats, openPrivateChat } from "../api/api";

function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [searchPublicId, setSearchPublicId] = useState("");
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadChats();
  }, []);

  async function loadChats() {
    try {
      const data = await getUserChats(user.id);
      setChats(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSearchAndOpen() {
    setError("");

    try {
      const foundUser = await findUserByPublicId(searchPublicId);

      const chat = await openPrivateChat({
        currentUserId: user.id,
        targetUserPublicId: foundUser.publicId,
      });

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2>Мои чаты</h2>
          <p>
            {user?.username} ({user?.publicId})
          </p>
        </div>

        <button onClick={handleLogout} style={buttonStyle}>
          Выйти
        </button>
      </div>

      <div style={cardStyle}>
        <h3>Найти пользователя по publicId</h3>
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
        {chats.map((chat) => (
          <Link key={chat.chatId} to={`/chats/${chat.chatId}`} style={chatCardStyle}>
            <strong>{chat.otherUser?.username}</strong>
            <div>{chat.otherUser?.publicId}</div>
          </Link>
        ))}
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