import { NavLink } from "react-router-dom";

function BottomNav({ palette }) {
  const colors =
    palette || {
      navBg: "#061126",
      border: "#13294d",
      accent: "#a100ff",
      muted: "#8f96aa",
      text: "#ffffff",
    };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: 390,
        height: 72,
        background: colors.navBg,
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxSizing: "border-box",
      }}
    >
      <NavLink
        to="/chats"
        style={({ isActive }) => ({
          textDecoration: "none",
          fontSize: 18,
          fontWeight: 500,
          color: isActive ? colors.accent : colors.muted,
        })}
      >
        Чаты
      </NavLink>

      <NavLink
        to="/settings"
        style={({ isActive }) => ({
          textDecoration: "none",
          fontSize: 18,
          fontWeight: 500,
          color: isActive ? colors.accent : colors.muted,
        })}
      >
        Настройки
      </NavLink>
    </nav>
  );
}

export default BottomNav;