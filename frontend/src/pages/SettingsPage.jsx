import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/ui/BottomNav";

function getSavedThemeSettings() {
  try {
    return (
      JSON.parse(localStorage.getItem("appTheme")) || {
        mode: "black",
        customColor: "#e8b8ff",
      }
    );
  } catch {
    return {
      mode: "black",
      customColor: "#e8b8ff",
    };
  }
}

function buildPalette(mode, customColor = "#e8b8ff") {
  if (mode === "white") {
    return {
      pageBg: "#f3f4f6",
      headerBg: "#ffffff",
      cardBg: "#e5e7eb",
      text: "#111827",
      muted: "#6b7280",
      border: "#d1d5db",
      navBg: "#ffffff",
      accent: "#a100ff",
      logoutBg: "#d9dde5",
    };
  }

  if (mode === "gray") {
    return {
      pageBg: "#586477",
      headerBg: "#526072",
      cardBg: "#465466",
      text: "#ffffff",
      muted: "#d1d5db",
      border: "#718096",
      navBg: "#465466",
      accent: "#b14cff",
      logoutBg: "#35445a",
    };
  }

  if (mode === "custom") {
    return {
      pageBg: customColor,
      headerBg: "rgba(255,255,255,0.10)",
      cardBg: "rgba(0,0,0,0.14)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.8)",
      border: "rgba(255,255,255,0.22)",
      navBg: "rgba(0,0,0,0.18)",
      accent: "#a100ff",
      logoutBg: "rgba(0,0,0,0.18)",
    };
  }

  return {
    pageBg: "#071631",
    headerBg: "#081a38",
    cardBg: "#091b39",
    text: "#ffffff",
    muted: "#9ca3af",
    border: "#13294d",
    navBg: "#061126",
    accent: "#a100ff",
    logoutBg: "#1b2d4d",
  };
}

function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [themeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = palette.pageBg;
    document.body.style.color = palette.text;
    document.body.style.fontFamily =
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, [palette]);

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const avatarLetter = user?.username?.charAt(0)?.toUpperCase() || "P";

  return (
    <div
      style={{
        height: "100dvh",
        background: palette.pageBg,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          height: "100dvh",
          background: palette.pageBg,
          color: palette.text,
          borderRadius: 32,
          overflow: "hidden",
          border: `1px solid ${palette.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 18px",
            borderBottom: `1px solid ${palette.border}`,
            background: palette.headerBg,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => navigate("/chats")}
            style={{
              background: "transparent",
              border: "none",
              color: palette.text,
              fontSize: 26,
              cursor: "pointer",
            }}
          >
            ←
          </button>

          <div style={{ fontSize: 18, fontWeight: 700 }}>Настройки</div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            paddingBottom: 90,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #c35bff 0%, #8c14ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {avatarLetter}
            </div>

            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {user?.username || "Пользователь"}
              </div>
              <div style={{ fontSize: 15, color: palette.muted }}>
                @{user?.publicId || "publicid"}
              </div>
            </div>
          </div>

          <MenuButton palette={palette} onClick={() => navigate("/profile")}>
            Профиль
          </MenuButton>

          <MenuButton palette={palette} onClick={() => navigate("/theme")}>
            Тема
          </MenuButton>

          <MenuButton palette={palette} onClick={() => navigate("/chat-theme")}>
            Тема чатов
          </MenuButton>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              marginTop: 12,
              minHeight: 56,
              background: palette.logoutBg,
              border: "none",
              borderRadius: 14,
              color: "#ff4b4b",
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            Выйти
          </button>
        </div>

        <BottomNav palette={palette} />
      </div>
    </div>
  );
}

function MenuButton({ children, onClick, palette }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 56,
        background: palette.cardBg,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        color: palette.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        fontSize: 18,
        cursor: "pointer",
        marginBottom: 12,
      }}
    >
      <span>{children}</span>
      <span style={{ color: palette.muted, fontSize: 24 }}>›</span>
    </button>
  );
}

export default SettingsPage;