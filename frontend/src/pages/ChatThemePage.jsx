import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      panelBg: "#ffffff",
      cardBg: "#e5e7eb",
      inputBg: "#f8fafc",
      text: "#111827",
      muted: "#6b7280",
      accent: "#a100ff",
      border: "#d1d5db",
    };
  }

  if (mode === "gray") {
    return {
      pageBg: "#586477",
      panelBg: "#526072",
      cardBg: "#465466",
      inputBg: "#3f4a5d",
      text: "#ffffff",
      muted: "#d1d5db",
      accent: "#b14cff",
      border: "#718096",
    };
  }

  if (mode === "custom") {
    return {
      pageBg: customColor,
      panelBg: "rgba(255,255,255,0.10)",
      cardBg: "rgba(0,0,0,0.12)",
      inputBg: "rgba(0,0,0,0.16)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.85)",
      accent: "#a100ff",
      border: "rgba(255,255,255,0.28)",
    };
  }

  return {
    pageBg: "#071631",
    panelBg: "#081a38",
    cardBg: "#091b39",
    inputBg: "#06142b",
    text: "#ffffff",
    muted: "#9ca3af",
    accent: "#a100ff",
    border: "#13294d",
  };
}

function applyThemeToDocument(palette) {
  document.body.style.margin = "0";
  document.body.style.background = palette.pageBg;
  document.body.style.color = palette.text;
  document.body.style.fontFamily =
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

const PRESET_BACKGROUNDS = [
  {
    id: "bg-1",
    type: "gradient",
    value: "linear-gradient(135deg, #2bd2ff 0%, #2e3192 100%)",
  },
  {
    id: "bg-2",
    type: "gradient",
    value: "linear-gradient(135deg, #ff4f93 0%, #ffe66d 45%, #7cf4ff 100%)",
  },
  {
    id: "bg-3",
    type: "image",
    value:
      "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80')",
  },
  {
    id: "bg-4",
    type: "image",
    value:
      "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80')",
  },
  {
    id: "bg-5",
    type: "gradient",
    value: "linear-gradient(135deg, #ff004c 0%, #5b00ff 50%, #00c2ff 100%)",
  },
  {
    id: "bg-6",
    type: "gradient",
    value: "linear-gradient(135deg, #d8d7ff 0%, #b5e9ff 45%, #c8b6ff 100%)",
  },
];

function ChatThemePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [themeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const [selectedChatTheme, setSelectedChatTheme] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chatTheme")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    applyThemeToDocument(palette);
  }, [palette]);

  const saveChatTheme = (theme) => {
    setSelectedChatTheme(theme);
    localStorage.setItem("chatTheme", JSON.stringify(theme));
    alert("Тема чата сохранена");
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const uploadedTheme = {
        id: "uploaded",
        type: "image",
        value: `url('${reader.result}')`,
      };
      saveChatTheme(uploadedTheme);
    };
    reader.readAsDataURL(file);
  };

  const isSelected = (id) => selectedChatTheme?.id === id;

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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 18px",
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <button
            onClick={() => navigate("/settings")}
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

          <div style={{ fontSize: 18, fontWeight: 700 }}>Тема чатов</div>
        </div>

        <div style={{ padding: 18 }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "none",
              borderRadius: 14,
              background: "linear-gradient(90deg, #a100ff 0%, #c82cff 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            ⤴ Загрузить свою картинку
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />

          <div
            style={{
              fontSize: 14,
              color: palette.muted,
              marginBottom: 12,
            }}
          >
            Готовые фоны
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {PRESET_BACKGROUNDS.map((item) => (
              <button
                key={item.id}
                onClick={() => saveChatTheme(item)}
                style={{
                  position: "relative",
                  height: 82,
                  borderRadius: 12,
                  border: isSelected(item.id)
                    ? "3px solid #c65bff"
                    : `1px solid ${palette.border}`,
                  overflow: "hidden",
                  cursor: "pointer",
                  padding: 0,
                  background: "transparent",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: item.value,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {isSelected(item.id) && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedChatTheme?.id === "uploaded" && (
            <div
              style={{
                marginTop: 18,
                padding: 12,
                borderRadius: 12,
                border: `1px solid ${palette.border}`,
                background: palette.cardBg,
                color: palette.text,
                fontSize: 14,
              }}
            >
              Сейчас выбрана твоя загруженная картинка.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatThemePage;