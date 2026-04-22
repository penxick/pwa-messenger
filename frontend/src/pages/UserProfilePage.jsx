import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      panelBg: "#ffffff",
      cardBg: "#e5e7eb",
      text: "#111827",
      muted: "#6b7280",
      border: "#d1d5db",
    };
  }

  if (mode === "gray") {
    return {
      pageBg: "#586477",
      panelBg: "#526072",
      cardBg: "#465466",
      text: "#ffffff",
      muted: "#d1d5db",
      border: "#718096",
    };
  }

  if (mode === "custom") {
    return {
      pageBg: customColor,
      panelBg: "rgba(255,255,255,0.10)",
      cardBg: "rgba(0,0,0,0.12)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.80)",
      border: "rgba(255,255,255,0.25)",
    };
  }

  return {
    pageBg: "#071631",
    panelBg: "#081a38",
    cardBg: "#091b39",
    text: "#ffffff",
    muted: "#9ca3af",
    border: "#13294d",
  };
}

function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [themeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = palette.pageBg;
    document.body.style.color = palette.text;
    document.body.style.fontFamily =
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, [palette]);

  useEffect(() => {
    loadPublicProfile();
  }, [userId]);

  async function loadPublicProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:8080/api/users/${userId}/public-profile`);

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Не удалось загрузить профиль пользователя");
      }

      setProfile(data);
    } catch (err) {
      setError(err.message || "Ошибка загрузки профиля");
    } finally {
      setLoading(false);
    }
  }

  const avatarLetter = profile?.username?.charAt(0)?.toUpperCase() || "U";

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
            onClick={() => navigate(-1)}
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

          <div style={{ fontSize: 18, fontWeight: 700 }}>Профиль</div>
        </div>

        {loading ? (
          <div style={{ padding: 18, color: palette.muted }}>Загрузка профиля...</div>
        ) : error ? (
          <div style={{ padding: 18, color: "#ff5b5b" }}>{error}</div>
        ) : (
          <>
            <div style={{ padding: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 8,
                  marginBottom: 18,
                }}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 42,
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(180deg, #c35bff 0%, #8c14ff 100%)",
                    }}
                  >
                    {avatarLetter}
                  </div>
                )}
              </div>

              <Field palette={palette} label="Имя" value={profile?.username || ""} />
              <Field palette={palette} label="ID" value={profile?.publicId || ""} />
              <Field palette={palette} label="О себе" value={profile?.bio || "Не указано"} multiline />
              <Field
                palette={palette}
                label="Дата рождения"
                value={profile?.birthDate || "Не указана"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ palette, label, value, multiline = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          marginBottom: 8,
          fontSize: 15,
          color: palette.text,
        }}
      >
        {label}
      </div>

      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "14px 16px",
          borderRadius: 12,
          border: `1px solid ${palette.border}`,
          background: palette.cardBg,
          color: palette.text,
          fontSize: 16,
          minHeight: multiline ? 112 : "auto",
          whiteSpace: multiline ? "pre-wrap" : "normal",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default UserProfilePage;