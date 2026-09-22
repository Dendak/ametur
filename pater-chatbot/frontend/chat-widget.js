// Pater-Chatbot – einbettbares Chat-Widget (Prototyp)
//
// Einbindung auf einer beliebigen Seite:
//   <script src="chat-widget.js" data-backend="https://<backend-host>" defer></script>
//
// data-backend zeigt auf das Backend (server.mjs); ohne Angabe wird derselbe
// Host verwendet (lokaler Test über die Demo-Seite des Backends).
(function () {
  "use strict";

  const script = document.currentScript;
  const BACKEND = (script && script.dataset.backend) || "";
  const API_URL = BACKEND.replace(/\/$/, "") + "/api/chat";

  const history = []; // {role, content} – wird ans Backend mitgeschickt

  // ---------- Stile ----------
  const style = document.createElement("style");
  style.textContent = `
    .pcb-launcher {
      position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 9999;
      width: 3.5rem; height: 3.5rem; border-radius: 50%; border: none;
      background: #3e3d49; color: #fff4e6; font-size: 1.5rem; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,.3);
    }
    .pcb-panel {
      position: fixed; right: 1.25rem; bottom: 5.5rem; z-index: 9999;
      width: min(22rem, calc(100vw - 2rem)); height: min(28rem, 70vh);
      display: none; flex-direction: column; overflow: hidden;
      background: #fff4e6; color: #3e3d49; border-radius: 1rem;
      box-shadow: 0 8px 30px rgba(0,0,0,.35);
      font-family: "Segoe UI", system-ui, sans-serif; font-size: .95rem;
    }
    .pcb-panel.open { display: flex; }
    .pcb-head { background: #3e3d49; color: #fff4e6; padding: .7rem 1rem; }
    .pcb-head small { display: block; opacity: .75; font-size: .72rem; }
    .pcb-log { flex: 1; overflow-y: auto; padding: .8rem; }
    .pcb-msg { margin: 0 0 .6rem; padding: .5rem .7rem; border-radius: .7rem;
      max-width: 85%; white-space: pre-wrap; line-height: 1.4; }
    .pcb-msg.user { background: #e78439; color: #fff; margin-left: auto; }
    .pcb-msg.bot  { background: #f1f1de; }
    .pcb-msg.bot .pcb-src { display: block; margin-top: .35rem;
      font-size: .72rem; opacity: .7; }
    .pcb-form { display: flex; gap: .4rem; padding: .6rem; border-top: 1px solid #ddd; }
    .pcb-form input { flex: 1; border: 1px solid #ccc; border-radius: .5rem;
      padding: .5rem .6rem; font: inherit; }
    .pcb-form button { border: none; border-radius: .5rem; padding: .5rem .9rem;
      background: #e78439; color: #fff; font: inherit; cursor: pointer; }
    .pcb-form button:disabled { opacity: .5; cursor: wait; }
  `;
  document.head.appendChild(style);

  // ---------- Aufbau ----------
  const launcher = document.createElement("button");
  launcher.className = "pcb-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Chat mit dem Pater öffnen");
  launcher.textContent = "💬";

  const panel = document.createElement("div");
  panel.className = "pcb-panel";
  panel.innerHTML = `
    <div class="pcb-head">
      <strong>Fragen an den Pater</strong>
      <small>KI-Chatbot auf Basis echter Interviews – kann Fehler machen.</small>
    </div>
    <div class="pcb-log" role="log" aria-live="polite"></div>
    <form class="pcb-form">
      <input type="text" maxlength="500" placeholder="Ihre Frage …"
             aria-label="Ihre Frage an den Pater" required>
      <button type="submit">Senden</button>
    </form>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const log = panel.querySelector(".pcb-log");
  const form = panel.querySelector(".pcb-form");
  const input = form.querySelector("input");
  const send = form.querySelector("button");

  function addMessage(role, text, quellen) {
    const el = document.createElement("p");
    el.className = "pcb-msg " + (role === "user" ? "user" : "bot");
    el.textContent = text;
    if (quellen && quellen.length) {
      const src = document.createElement("span");
      src.className = "pcb-src";
      src.textContent = "Quelle: " + quellen
        .map((q) => `Folge ${q.folge} (${q.thema}, ${q.timestamp})`)
        .join(" · ");
      el.appendChild(src);
    }
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  launcher.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) {
      if (!log.childElementCount) {
        addMessage("bot", "Grüß Gott! Fragen Sie mich gern etwas zu meinem Leben – zur Kindheit, zur Berufung oder zu den Jahren auf der Mission.");
      }
      input.focus();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    addMessage("user", question);
    history.push({ role: "user", content: question });
    input.value = "";
    send.disabled = true;
    const pending = addMessage("bot", "…");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: history.slice(0, -1) }),
      });
      const data = await res.json();
      pending.remove();
      if (!res.ok) {
        addMessage("bot", data.error || "Da ist etwas schiefgegangen – bitte später noch einmal versuchen.");
      } else {
        addMessage("bot", data.answer, data.quellen);
        history.push({ role: "assistant", content: data.answer });
      }
    } catch {
      pending.remove();
      addMessage("bot", "Der Chatbot ist gerade nicht erreichbar.");
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
