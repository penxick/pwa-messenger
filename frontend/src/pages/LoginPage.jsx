import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

function LoginPage() {
  const [publicId, setPublicId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser({ publicId, password });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/chats");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2>Вход</h2>

        <input
          placeholder="Public ID"
          value={publicId}
          onChange={(e) => setPublicId(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Войти
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </form>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardStyle = {
  width: 360,
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
};

export default LoginPage;