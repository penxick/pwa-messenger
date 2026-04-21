import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <nav style={navStyle}>
      <NavLink
        to="/chats"
        style={({ isActive }) => ({
          ...linkStyle,
          color: isActive ? "#b12cff" : "#8f96aa",
        })}
      >
        Чаты
      </NavLink>

      <NavLink
        to="/settings"
        style={({ isActive }) => ({
          ...linkStyle,
          color: isActive ? "#b12cff" : "#8f96aa",
        })}
      >
        Настройки
      </NavLink>
    </nav>
  );
}

const navStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  maxWidth: 390,
  height: 72,
  background: "#071226",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
};

const linkStyle = {
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 500,
};

export default BottomNav;