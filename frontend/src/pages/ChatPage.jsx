import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChatMessages, getUserChats, sendMessage } from "../api/api";

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

function getSavedChatTheme() {
  try {
    return JSON.parse(localStorage.getItem("chatTheme")) || null;
  } catch {
    return null;
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
      myMessageBg: "#c084fc",
      myMessageText: "#ffffff",
      otherMessageBg: "#ffffff",
      otherMessageText: "#111827",
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
      myMessageBg: "#c084fc",
      myMessageText: "#ffffff",
      otherMessageBg: "#3f4a5d",
      otherMessageText: "#ffffff",
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
      border: "rgba(255,255,255,0.22)",
      myMessageBg: "#c084fc",
      myMessageText: "#ffffff",
      otherMessageBg: "rgba(0,0,0,0.22)",
      otherMessageText: "#ffffff",
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
    myMessageBg: "#c084fc",
    myMessageText: "#ffffff",
    otherMessageBg: "#ffffff",
    otherMessageText: "#111827",
  };
}

function buildChatBackgroundStyle(chatTheme) {
  if (!chatTheme?.value) {
    return {
      background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.08) 100%)",
    };
  }

  if (chatTheme.type === "image") {
    return {
      backgroundImage: chatTheme.value,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return {
    backgroundImage: chatTheme.value,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [themeSettings] = useState(getSavedThemeSettings());
  const [chatTheme] = useState(getSavedChatTheme());

  const palette = useMemo(
    () => buildPalette(themeSettings.mode, themeSettings.customColor),
    [themeSettings]
  );

  const chatBackgroundStyle = useMemo(
    () => buildChatBackgroundStyle(chatTheme),
    [chatTheme]
  );

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [chatInfo, setChatInfo] = useState(null);

  const intervalRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const shouldForceScrollRef = useRef(false);
  const initialLoadDoneRef = useRef(false);

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

    loadChatInfo();
    loadMessages(false);

    //intervalRef.current = setInterval(() => {
      //loadMessages(true);
      //loadChatInfo(true);
    //}, 700);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [chatId]);

  async function loadChatInfo(silent = false) {
    try {
      const chats = await getUserChats(user.id);
      const currentChat = chats.find((item) => String(item.chatId) === String(chatId)) || null;
      setChatInfo(currentChat);
      if (!silent) setError("");
    } catch (err) {
      if (!silent) {
        setError(err.message || "Не удалось загрузить чат");
      }
    }
  }

  function isNearBottom() {
    const box = messagesBoxRef.current;
    if (!box) return true;

    const distanceFromBottom = box.scrollHeight - box.scrollTop - box.clientHeight;
    return distanceFromBottom < 120;
  }

  function scrollToBottom(behavior = "smooth") {
    const box = messagesBoxRef.current;
    if (!box) return;
    box.scrollTo({
      top: box.scrollHeight,
      behavior,
    });
  }

  async function loadMessages(silent = false) {
    try {
      const nearBottomBeforeUpdate = isNearBottom();
      const data = await getChatMessages(chatId);

      setMessages(data);

      requestAnimationFrame(() => {
        if (!initialLoadDoneRef.current) {
          initialLoadDoneRef.current = true;
          scrollToBottom("auto");
          return;
        }

        if (shouldForceScrollRef.current) {
          shouldForceScrollRef.current = false;
          scrollToBottom("smooth");
          return;
        }

        if (nearBottomBeforeUpdate) {
          scrollToBottom("smooth");
        }
      });

      if (!silent) setError("");
    } catch (err) {
      if (!silent) {
        setError(err.message || "Не удалось загрузить сообщения");
      }
    }
  }

  async function handleSend() {
    if (!text.trim()) return;

    try {
      shouldForceScrollRef.current = true;

      await sendMessage({
        chatId: Number(chatId),
        senderId: user.id,
        text: text.trim(),
      });

      setText("");
      await loadMessages(true);
    } catch (err) {
      setError(err.message || "Не удалось отправить сообщение");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  const otherUser = chatInfo?.otherUser || null;
  const avatarLetter = otherUser?.username?.charAt(0)?.toUpperCase() || "U";

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
            gap: 12,
            padding: "16px 16px",
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

          <button
            onClick={() => {
              if (otherUser?.id) {
                navigate(`/users/${otherUser.id}`);
              }
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "transparent",
              border: "none",
              color: palette.text,
              padding: 0,
              cursor: otherUser?.id ? "pointer" : "default",
              textAlign: "left",
            }}
          >
            {otherUser?.avatarUrl ? (
              <img
                src={otherUser.avatarUrl}
                alt="avatar"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "linear-gradient(180deg, #c35bff 0%, #8c14ff 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {avatarLetter}
              </div>
            )}

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {otherUser?.username || "Пользователь"}
              </div>

              <div
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: palette.muted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                @{otherUser?.publicId || "publicid"}
              </div>
            </div>
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 16px",
              color: "#ff5b5b",
              fontSize: 14,
              background: palette.pageBg,
            }}
          >
            {error}
          </div>
        )}

        <div
          ref={messagesBoxRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 12px",
            position: "relative",
            ...chatBackgroundStyle,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                chatTheme?.type === "image"
                  ? "rgba(0,0,0,0.18)"
                  : "rgba(0,0,0,0.06)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: palette.muted,
                  marginTop: 20,
                  fontSize: 15,
                }}
              >
                Сообщений пока нет
              </div>
            ) : (
              messages.map((message) => {
                const isMine = message.sender.id === user.id;

                return (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "74%",
                        padding: "10px 12px 8px",
                        borderRadius: 16,
                        background: isMine
                          ? palette.myMessageBg
                          : palette.otherMessageBg,
                        color: isMine
                          ? palette.myMessageText
                          : palette.otherMessageText,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                        wordBreak: "break-word",
                      }}
                    >
                      {!isMine && (
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            marginBottom: 5,
                            opacity: 0.8,
                          }}
                        >
                          {message.sender.username}
                        </div>
                      )}

                      <div style={{ fontSize: 15, lineHeight: 1.35 }}>
                        {message.text}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          opacity: 0.7,
                          textAlign: "right",
                        }}
                      >
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            borderTop: `1px solid ${palette.border}`,
            background: palette.panelBg,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение"
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 24,
              border: "none",
              outline: "none",
              background: palette.inputBg,
              color: palette.text,
              fontSize: 15,
            }}
          />

          <button
            onClick={handleSend}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(90deg, #a100ff 0%, #c82cff 100%)",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
            title="Отправить"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;