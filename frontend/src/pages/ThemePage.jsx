import { useEffect, useMemo, useState } from "react";
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
      cardBg: "#d4d4d8",
      inputBg: "#f8fafc",
      text: "#111827",
      muted: "#6b7280",
      accent: "#a100ff",
      border: "#d1d5db",
      optionBg: "#d4d4d8",
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
      optionBg: "#465466",
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
      optionBg: "rgba(0,0,0,0.12)",
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
    optionBg: "#0a1730",
  };
}

function applyThemeToDocument(palette) {
  document.body.style.margin = "0";
  document.body.style.background = palette.pageBg;
  document.body.style.color = palette.text;
  document.body.style.fontFamily =
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

function ThemeOption({ title, circleColor, selected, onClick, palette }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 14,
        border: selected ? `2px solid ${palette.text}` : `1px solid ${palette.border}`,
        background: palette.optionBg,
        color: palette.text,
        cursor: "pointer",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: circleColor,
            border: "1px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
      </div>

      <div
        style={{
          fontSize: 24,
          color: selected ? "#c65bff" : "transparent",
          fontWeight: 700,
        }}
      >
        ✓
      </div>
    </button>
  );
}

function ThemePage() {
  const navigate = useNavigate();

  const [themeSettings, setThemeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const [customColor, setCustomColor] = useState(themeSettings.customColor || "#e8b8ff");

  useEffect(() => {
    applyThemeToDocument(palette);
  }, [palette]);

  const saveTheme = (nextSettings) => {
    localStorage.setItem("appTheme", JSON.stringify(nextSettings));
    setThemeSettings(nextSettings);
  };

  const handlePresetClick = (mode) => {
    saveTheme({
      ...themeSettings,
      mode,
    });
  };

  const handleApplyCustom = () => {
    saveTheme({
      mode: "custom",
      customColor,
    });
  };

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

          <div style={{ fontSize: 18, fontWeight: 700 }}>Тема</div>
        </div>

        <div style={{ padding: 18 }}>
          <ThemeOption
            title="Белая"
            circleColor="#f9fafb"
            selected={themeSettings.mode === "white"}
            onClick={() => handlePresetClick("white")}
            palette={palette}
          />

          <ThemeOption
            title="Черная"
            circleColor="#071631"
            selected={themeSettings.mode === "black"}
            onClick={() => handlePresetClick("black")}
            palette={palette}
          />

          <ThemeOption
            title="Серая"
            circleColor="#586477"
            selected={themeSettings.mode === "gray"}
            onClick={() => handlePresetClick("gray")}
            palette={palette}
          />

          <div
            style={{
              marginTop: 8,
              background: palette.optionBg,
              border: `1px solid ${palette.border}`,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                marginBottom: 14,
              }}
            >
              <span style={{ color: palette.accent, fontSize: 18 }}>◔</span>
              <span>Своя палитра</span>
              {themeSettings.mode === "custom" && (
                <span style={{ marginLeft: "auto", color: "#c65bff", fontSize: 22 }}>
                  ✓
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                style={{
                  width: 58,
                  height: 42,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              />

              <button
                onClick={handleApplyCustom}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  border: "none",
                  borderRadius: 12,
                  background: "linear-gradient(90deg, #a100ff 0%, #c82cff 100%)",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemePage;