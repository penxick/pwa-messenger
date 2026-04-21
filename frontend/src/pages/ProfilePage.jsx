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
      danger: "#ef4444",
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
      danger: "#ef4444",
    };
  }

  if (mode === "custom") {
    return {
      pageBg: customColor,
      panelBg: "rgba(255,255,255,0.18)",
      cardBg: "rgba(0,0,0,0.12)",
      inputBg: "rgba(0,0,0,0.18)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.8)",
      accent: "#a100ff",
      border: "rgba(255,255,255,0.25)",
      danger: "#ff4d4f",
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
    danger: "#ef4444",
  };
}

function applyThemeToDocument(palette) {
  document.body.style.margin = "0";
  document.body.style.background = palette.pageBg;
  document.body.style.color = palette.text;
  document.body.style.fontFamily =
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [themeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const [form, setForm] = useState({
    name: "",
    publicId: "",
    bio: "",
    birthDate: "",
    avatar: "",
  });

  useEffect(() => {
    applyThemeToDocument(palette);
  }, [palette]);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("currentUser")) || {};

      setForm({
        name: savedUser.username || savedUser.name || "",
        publicId: savedUser.publicId || "",
        bio: savedUser.bio || "",
        birthDate: savedUser.birthDate || "",
        avatar: savedUser.avatar || "",
      });
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setForm((prev) => ({
      ...prev,
      avatar: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    const updatedUser = {
      ...savedUser,
      username: form.name,
      name: form.name,
      publicId: form.publicId,
      bio: form.bio,
      birthDate: form.birthDate,
      avatar: form.avatar,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Профиль сохранён");
    navigate("/settings");
  };

  const avatarContent = form.avatar ? (
    <img
      src={form.avatar}
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
        background: "linear-gradient(180deg, #c35bff 0%, #8c14ff 100%)",
        color: "#fff",
        fontWeight: 700,
      }}
    >
      {form.name?.charAt(0)?.toUpperCase() || "P"}
    </div>
  );

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

          <div style={{ fontSize: 18, fontWeight: 700 }}>Профиль</div>
        </div>

        <div style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 8,
              marginBottom: 18,
            }}
          >
            <div style={{ position: "relative" }}>
              {avatarContent}

              {form.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "none",
                    background: "#ff2d2d",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  ×
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "none",
                  background: "#a100ff",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 16,
                }}
                title="Изменить аватар"
              >
                📷
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 8, fontSize: 15 }}>Имя</div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Введите имя"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${palette.border}`,
                background: palette.inputBg,
                color: palette.text,
                fontSize: 16,
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 8, fontSize: 15 }}>ID</div>
            <input
              type="text"
              value={form.publicId}
              onChange={(e) => handleChange("publicId", e.target.value)}
              placeholder="Введите ID"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${palette.border}`,
                background: palette.inputBg,
                color: palette.text,
                fontSize: 16,
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 8, fontSize: 15 }}>О себе</div>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Расскажите о себе"
              rows={5}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${palette.border}`,
                background: palette.inputBg,
                color: palette.text,
                fontSize: 16,
                outline: "none",
                resize: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontSize: 15 }}>Дата рождения</div>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${palette.border}`,
                background: palette.inputBg,
                color: palette.text,
                fontSize: 16,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ padding: 18, paddingTop: 0 }}>
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: 14,
              background: "linear-gradient(90deg, #a100ff 0%, #c82cff 100%)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;