import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findUserByPublicId, getUserChats, openPrivateChat } from "../api/api";
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
    return { mode: "black", customColor: "#e8b8ff" };
  }
}

function buildPalette(mode, customColor = "#e8b8ff") {
  if (mode === "white") {
    return {
      pageBg: "#f3f4f6",
      headerBg: "#ffffff",
      panelBg: "#ffffff",
      cardBg: "#e5e7eb",
      inputBg: "#f8fafc",
      text: "#111827",
      muted: "#6b7280",
      accent: "#a100ff",
      border: "#d1d5db",
      navBg: "#ffffff",
    };
  }

  if (mode === "gray") {
    return {
      pageBg: "#586477",
      headerBg: "#526072",
      panelBg: "#526072",
      cardBg: "#465466",
      inputBg: "#3f4a5d",
      text: "#ffffff",
      muted: "#d1d5db",
      accent: "#b14cff",
      border: "#718096",
      navBg: "#465466",
    };
  }

  if (mode === "custom") {
    return {
      pageBg: customColor,
      headerBg: "rgba(255,255,255,0.10)",
      panelBg: "rgba(255,255,255,0.10)",
      cardBg: "rgba(0,0,0,0.12)",
      inputBg: "rgba(0,0,0,0.18)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.78)",
      accent: "#a100ff",
      border: "rgba(255,255,255,0.18)",
      navBg: "rgba(0,0,0,0.18)",
    };
  }

  return {
    pageBg: "#071631",
    headerBg: "#081a38",
    panelBg: "#081a38",
    cardBg: "#091b39",
    inputBg: "#06142b",
    text: "#ffffff",
    muted: "#9ca3af",
    accent: "#a100ff",
    border: "#13294d",
    navBg: "#061126",
  };
}

function applyThemeToDocument(palette) {
  document.body.style.margin = "0";
  document.body.style.background = palette.pageBg;
  document.body.style.color = palette.text;
  document.body.style.fontFamily =
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

function ChatsPage() {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const [themeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const [chats, setChats] = useState([]);
  const [searchPublicId, setSearchPublicId] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    applyThemeToDocument(palette);
  }, [palette]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadChats();

    //intervalRef.current = setInterval(() => {
      //loadChats(true);
    //}, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function loadChats(silent = false) {
    try {
      const data = await getUserChats(user.id);
      setChats(data);
      if (!silent) setError("");
    } catch (err) {
      if (!silent) setError(err.message);
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

  const avatarLetter = user?.username?.charAt(0)?.toUpperCase() || "P";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.pageBg,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          minHeight: "100vh",
          background: palette.pageBg,
          color: palette.text,
          borderRadius: 32,
          overflow: "hidden",
          boxSizing: "border-box",
          border: `1px solid ${palette.border}`,
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "18px 16px 14px",
            borderBottom: `1px solid ${palette.border}`,
            background: palette.headerBg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => navigate("/settings")}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(180deg, #c35bff 0%, #8c14ff 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {avatarLetter}
            </button>

            <div style={{ fontSize: 18, fontWeight: 700 }}>Чаты</div>
          </div>
        </div>

        <div style={{ padding: 10, paddingBottom: 94 }}>
          <div
            style={{
              background: palette.cardBg,
              borderRadius: 14,
              padding: 0,
              marginBottom: 18,
              border: `1px solid ${palette.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 10,
              }}
            >
              <input
                value={searchPublicId}
                onChange={(e) => setSearchPublicId(e.target.value)}
                placeholder="Поиск"
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "none",
                  outline: "none",
                  background: palette.inputBg,
                  color: palette.text,
                  fontSize: 15,
                }}
              />

              <button
                onClick={handleSearchAndOpen}
                style={{
                  padding: "14px 14px",
                  minWidth: 48,
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(90deg, #a100ff 0%, #c82cff 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                title="Открыть чат"
              >
                +
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                color: "#ff5b5b",
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {chats.length === 0 ? (
            <div
              style={{
                minHeight: "58vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: palette.muted,
                textAlign: "center",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 24, opacity: 0.95 }}>У вас пока нет чатов</div>
              <div style={{ fontSize: 18, opacity: 0.7 }}>Начните общение!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {chats.map((chat) => {
                const otherUser = chat.otherUser || {};
                const otherLetter = otherUser?.username?.charAt(0)?.toUpperCase() || "U";

                return (
                  <button
                    key={chat.chatId}
                    onClick={() => navigate(`/chats/${chat.chatId}`)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 14px",
                      borderRadius: 16,
                      border: `1px solid ${palette.border}`,
                      background: palette.cardBg,
                      color: palette.text,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(180deg, #c35bff 0%, #8c14ff 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {otherLetter}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {otherUser.username || "Пользователь"}
                      </div>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 15,
                          color: palette.muted,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        @{otherUser.publicId || "publicid"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <BottomNav palette={palette} />
      </div>
    </div>
  );
}

export default ChatsPage;