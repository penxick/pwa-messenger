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
      panelBg: "#ffffff",
      cardBg: "#e5e7eb",
      inputBg: "#f8fafc",
      text: "#111827",
      muted: "#6b7280",
      accent: "#a100ff",
      border: "#d1d5db",
      buttonText: "#ffffff",
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
      buttonText: "#ffffff",
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
      muted: "rgba(255,255,255,0.80)",
      accent: "#a100ff",
      border: "rgba(255,255,255,0.25)",
      buttonText: "#ffffff",
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
    buttonText: "#ffffff",
  };
}

function formatBirthDateForInput(value) {
  if (!value) return "";
  return value;
}

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [themeSettings] = useState(getSavedThemeSettings());
  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    username: "",
    publicId: "",
    email: "",
    bio: "",
    birthDate: "",
    avatarUrl: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = palette.pageBg;
    document.body.style.color = palette.text;
    document.body.style.fontFamily =
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, [palette]);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`http://localhost:8080/api/users/${user.id}/profile`);

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Не удалось загрузить профиль");
      }

      setForm({
        username: data.username || "",
        publicId: data.publicId || "",
        email: data.email || "",
        bio: data.bio || "",
        birthDate: formatBirthDateForInput(data.birthDate),
        avatarUrl: data.avatarUrl || "",
      });
    } catch (err) {
      setError(err.message || "Ошибка загрузки профиля");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleStartEdit() {
    setIsEditing(true);
    setError("");
    setSuccess("");
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setError("");
    setSuccess("");
    loadProfile();
  }

  function handleAvatarClick() {
    if (!isEditing) return;
    fileInputRef.current?.click();
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        avatarUrl: String(reader.result),
      }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`http://localhost:8080/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          publicId: form.publicId,
          bio: form.bio,
          birthDate: form.birthDate || null,
          avatarUrl: form.avatarUrl || null,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Не удалось сохранить профиль");
      }

      const updatedUser = {
        ...user,
        username: data.username,
        publicId: data.publicId,
        email: data.email,
        };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setForm({
        username: data.username || "",
        publicId: data.publicId || "",
        email: data.email || "",
        bio: data.bio || "",
        birthDate: formatBirthDateForInput(data.birthDate),
        avatarUrl: data.avatarUrl || "",
      });

      setIsEditing(false);
      setSuccess("Профиль сохранён");
    } catch (err) {
      setError(err.message || "Ошибка сохранения профиля");
    } finally {
      setSaving(false);
    }
  }

  const avatarLetter = form.username?.charAt(0)?.toUpperCase() || "P";

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
          boxSizing: "border-box",
          border: `1px solid ${palette.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "22px 18px",
            borderBottom: `1px solid ${palette.border}`,
            background: palette.headerBg,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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

          {!loading && (
            <button
              onClick={isEditing ? handleCancelEdit : handleStartEdit}
              style={{
                background: "transparent",
                border: "none",
                color: palette.text,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isEditing ? "Отм." : "Изм."}
            </button>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 18,
            paddingBottom: 24,
          }}
        >
          {loading ? (
            <div style={{ color: palette.muted }}>Загрузка профиля...</div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 8,
                  marginBottom: 18,
                }}
              >
                <div style={{ position: "relative" }}>
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
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

                  <button
                    onClick={handleAvatarClick}
                    disabled={!isEditing}
                    style={{
                      position: "absolute",
                      right: -2,
                      bottom: -2,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "none",
                      background: isEditing ? "#a100ff" : "#5b6070",
                      color: "#fff",
                      cursor: isEditing ? "pointer" : "default",
                      fontSize: 15,
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

              <FieldLabel palette={palette}>Имя</FieldLabel>
              <Input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                disabled={!isEditing}
                palette={palette}
                placeholder="Введите имя"
              />

              <FieldLabel palette={palette}>ID</FieldLabel>
              <Input
                value={form.publicId}
                onChange={(e) => handleChange("publicId", e.target.value)}
                disabled={!isEditing}
                palette={palette}
                placeholder="Введите ID"
              />

              <FieldLabel palette={palette}>Почта</FieldLabel>
              <Input
                value={form.email}
                disabled
                palette={palette}
                placeholder="Почта"
              />

              <FieldLabel palette={palette}>О себе</FieldLabel>
              <TextArea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!isEditing}
                palette={palette}
                placeholder="Расскажите о себе"
              />

              <FieldLabel palette={palette}>Дата рождения</FieldLabel>
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                disabled={!isEditing}
                palette={palette}
              />

              {error && (
                <div
                  style={{
                    marginTop: 14,
                    color: "#ff5b5b",
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    marginTop: 14,
                    color: "#67e18d",
                    fontSize: 14,
                  }}
                >
                  {success}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={!isEditing || saving}
                style={{
                  width: "100%",
                  marginTop: 18,
                  padding: "16px",
                  border: "none",
                  borderRadius: 14,
                  background:
                    !isEditing || saving
                      ? "#6b7280"
                      : "linear-gradient(90deg, #a100ff 0%, #c82cff 100%)",
                  color: palette.buttonText,
                  fontSize: 17,
                  fontWeight: 700,
                  cursor: !isEditing || saving ? "default" : "pointer",
                }}
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children, palette }) {
  return (
    <div
      style={{
        marginBottom: 8,
        marginTop: 14,
        fontSize: 15,
        color: palette.text,
      }}
    >
      {children}
    </div>
  );
}

function Input({ palette, disabled, ...props }) {
  return (
    <input
      {...props}
      disabled={disabled}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 16px",
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        background: disabled ? palette.cardBg : palette.inputBg,
        color: palette.text,
        fontSize: 16,
        outline: "none",
        opacity: disabled ? 0.95 : 1,
      }}
    />
  );
}

function TextArea({ palette, disabled, ...props }) {
  return (
    <textarea
      {...props}
      disabled={disabled}
      rows={5}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 16px",
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        background: disabled ? palette.cardBg : palette.inputBg,
        color: palette.text,
        fontSize: 16,
        outline: "none",
        resize: "none",
        opacity: disabled ? 0.95 : 1,
      }}
    />
  );
}

export default ProfilePage;