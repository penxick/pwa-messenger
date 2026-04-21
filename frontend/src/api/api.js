const API_BASE_URL = "http://localhost:8080";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");

  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data.message || data.error || "Ошибка запроса";
    throw new Error(message);
  }

  return data;
}

export async function registerUser(payload) {
  return request("/api/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request("/api/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(payload) {
  return request("/api/email/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUserChats(userId) {
  return request(`/api/chats/user/${userId}`);
}

export async function getChatMessages(chatId) {
  return request(`/api/chats/${chatId}/messages`);
}

export async function sendMessage(payload) {
  return request("/api/chats/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function findUserByPublicId(publicId) {
  return request(`/api/users/public/${publicId}`);
}

export async function openPrivateChat(payload) {
  return request("/api/chats/private/open", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}