import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [publicId, setPublicId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await registerUser({
        username,
        publicId,
        email,
        password,
      });

      navigate("/verify-email", {
        state: {
          userId: user.id,
          email: user.email,
        },
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2>Регистрация</h2>

        <input
          placeholder="Имя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Public ID"
          value={publicId}
          onChange={(e) => setPublicId(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Зарегистрироваться
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
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

export default RegisterPage;