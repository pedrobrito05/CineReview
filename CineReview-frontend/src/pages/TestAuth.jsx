import { useState } from "react";

export default function TestAuth() {
  const [output, setOutput] = useState(null);

  const API = "http://localhost:8000/api";

  function log(data) {
    setOutput(JSON.stringify(data, null, 2));
  }

  // 🔥 helper para CSRF cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // 1. LOGIN
  async function login() {
    const res = await fetch(`${API}/login/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "user",
        password: "user",
      }),
    });

    const data = await res.json();
    log({ step: "1. login", status: res.status, ...data });
  }

  // 2. SESSION TEST
  async function checkSession() {
    const res = await fetch(`${API}/user/`, {
      credentials: "include",
    });

    const data = await res.json();
    log({ step: "2. session (user logado)", status: res.status, ...data });
  }

  // 3. POST REVIEW (FIXED)
  async function sendPost() {

    // 🔥 garante que CSRF cookie existe
    await fetch(`${API}/user/`, {
      credentials: "include",
    });

    const csrfToken = getCookie("csrftoken");

    const res = await fetch(`${API}/reviews/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,   // 🔥 ISTO É O QUE ESTAVA EM FALTA
      },
      body: JSON.stringify({
        avaliacao: 8,
        texto: "Teste de review via fetch",
        filme: 1,
      }),
    });

    const data = await res.json();
    log({ step: "3. POST review", status: res.status, ...data });
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Teste Auth</h2>
      <p>Login → Session → POST</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={login}>1. Login</button>
        <button onClick={checkSession}>2. Check Session</button>
        <button onClick={sendPost}>3. Send POST Review</button>
      </div>

      <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
        {output ?? "Carrega num botão..."}
      </pre>
    </div>
  );
}