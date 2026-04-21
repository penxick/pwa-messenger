import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/api";

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const userId = location.state?.userId;
  const email = location.state?.email;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await verifyEmail({ userId, code });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!userId) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>Подтверждение почты</h2>
          <p>Нет данных о пользователе. Сначала зарегистрируйтесь.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2>Подтверждение почты</h2>
        <p>Введите код для: {email}</p>

        <input
          placeholder="Код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Подтвердить
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
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

export default VerifyEmailPage;