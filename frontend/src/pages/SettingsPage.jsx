import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <MainLayout title="Настройки" showBack onBack={() => navigate("/chats")}>
      <div style={profileCardStyle}>
        <div style={avatarStyle}>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>

        <div>
          <div style={nameStyle}>{user?.username || "Пользователь"}</div>
          <div style={idStyle}>@{user?.publicId || "publicid"}</div>
        </div>
      </div>

      <div style={menuListStyle}>
        <button style={menuButtonStyle} onClick={() => navigate("/profile")}>
          <span>Профиль</span>
          <span style={arrowStyle}>›</span>
        </button>

        <button style={menuButtonStyle} onClick={() => navigate("/theme")}>
          <span>Тема</span>
          <span style={arrowStyle}>›</span>
        </button>

        <button style={menuButtonStyle} onClick={() => navigate("/chat-theme")}>
          <span>Тема чатов</span>
          <span style={arrowStyle}>›</span>
        </button>

        <button style={logoutButtonStyle} onClick={handleLogout}>
          <span>Выйти</span>
        </button>
      </div>
    </MainLayout>
  );
}

const profileCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "12px 0 22px 0",
};

const avatarStyle = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "linear-gradient(180deg, #c347ff 0%, #8f1fff 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  color: "#fff",
  flexShrink: 0,
};

const nameStyle = {
  fontSize: 28,
  fontWeight: 600,
  color: "#fff",
};

const idStyle = {
  marginTop: 4,
  fontSize: 18,
  color: "#9aa3b5",
};

const menuListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const menuButtonStyle = {
  width: "100%",
  minHeight: 56,
  background: "#071226",
  border: "1px solid rgba(255,255,255,0.04)",
  borderRadius: 14,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 18px",
  fontSize: 20,
};

const logoutButtonStyle = {
  width: "100%",
  minHeight: 56,
  background: "rgba(255,255,255,0.08)",
  border: "none",
  borderRadius: 14,
  color: "#ff4b4b",
  display: "flex",
  alignItems: "center",
  padding: "0 18px",
  fontSize: 20,
  marginTop: 8,
};

const arrowStyle = {
  fontSize: 28,
  color: "#9aa3b5",
  lineHeight: 1,
};

export default SettingsPage;