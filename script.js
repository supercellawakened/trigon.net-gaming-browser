// ======================================================
// TRIGON ∆ - SCRIPT.JS
// ======================================================

// ================= GLOBAL STATE =================

let currentPage = "home";
let currentMode = "blue";
let soundEnabled = true;
let glowEnabled = true;

let shortcuts = JSON.parse(localStorage.getItem("trigonShortcuts") || "[]");
let accounts = JSON.parse(localStorage.getItem("trigonAccounts") || "[]");

const modes = {
  blue: {
    name: "Default Blue",
    color: "#238cff",
    symbol: "∆"
  },

  red: {
    name: "Default Red",
    color: "#ff304f",
    symbol: "∆"
  },

  custom: {
    name: "Default Custom",
    color: "#9b6cff",
    symbol: "∆"
  },

  trigon: {
    name: "Trigon",
    color: "#00d9ff",
    symbol: "∆"
  },

  ess: {
    name: "ESS",
    color: "#ff304f",
    symbol: "∆"
  }
};


// ================= LOADING SCREEN =================

window.addEventListener("load", () => {

  const loadingScreen = document.getElementById("loadingScreen");
  const loadingProgress = document.getElementById("loadingProgress");

  let progress = 0;

  const loader = setInterval(() => {

    progress += Math.floor(Math.random() * 8) + 3;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loader);

      setTimeout(() => {

        if (loadingScreen) {
          loadingScreen.style.opacity = "0";

          setTimeout(() => {
            loadingScreen.style.display = "none";

            const loginScreen =
              document.getElementById("loginScreen");

            if (loginScreen) {
              loginScreen.style.display = "flex";
            }

          }, 500);
        }

      }, 300);
    }

    if (loadingProgress) {
      loadingProgress.style.width = progress + "%";
    }

  }, 120);

});


// ================= LOGIN =================

function login() {

  const username =
    document.getElementById("username")?.value.trim();

  const password =
    document.getElementById("password")?.value;

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  localStorage.setItem("trigonLoggedIn", "true");
  localStorage.setItem("trigonUsername", username);

  const loginScreen =
    document.getElementById("loginScreen");

  const dashboard =
    document.getElementById("dashboard");

  if (loginScreen) {
    loginScreen.style.display = "none";
  }

  if (dashboard) {
    dashboard.style.display = "flex";
  }

  notify("Welcome to Trigon, " + username + " ∆");
}


// ================= LOGOUT =================

function logout() {

  localStorage.removeItem("trigonLoggedIn");

  location.reload();
}


// ================= FORGOT PASSWORD =================

function forgotPassword() {

  openModal("resetPasswordModal");
}


// ================= PAGE NAVIGATION =================

function showPage(page) {

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target =
    document.getElementById(page + "Page");

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const nav =
    document.querySelector(`[data-page="${page}"]`);

  if (nav) {
    nav.classList.add("active");
  }

  currentPage = page;
}


// ================= GOOGLE =================

function openGoogle() {

  showTabLoading();

  setTimeout(() => {
    window.open(
      "https://www.google.com",
      "_blank"
    );
  }, 400);
}


// ================= CHATGPT =================

function openChatGPT() {

  showTabLoading();

  setTimeout(() => {
    window.open(
      "https://chatgpt.com",
      "_blank"
    );
  }, 400);
}


// ================= TAB LOADING =================

function showTabLoading() {

  const overlay =
    document.getElementById("tabLoading");

  if (!overlay) return;

  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
  }, 700);
}


// ================= TAB PRELOADING =================

const preloadSites = [
  "https://www.google.com",
  "https://chatgpt.com"
];

function preloadTabs() {

  preloadSites.forEach(url => {

    try {

      const origin =
        new URL(url).origin;

      const preconnect =
        document.createElement("link");

      preconnect.rel = "preconnect";
      preconnect.href = origin;

      document.head.appendChild(preconnect);

      const dns =
        document.createElement("link");

      dns.rel = "dns-prefetch";
      dns.href = origin;

      document.head.appendChild(dns);

    } catch (error) {
      console.log("Preload error:", error);
    }

  });

  console.log("∆ Trigon tabs prepared.");
}

setTimeout(preloadTabs, 800);


// ================= SEARCH =================

function performSearch() {

  const input =
    document.getElementById("searchInput");

  if (!input) return;

  const query = input.value.trim();

  if (!query) return;

  const googleURL =
    "https://www.google.com/search?q=" +
    encodeURIComponent(query);

  window.open(googleURL, "_blank");

  addSearchNotification(query);
}


// ================= ENTER KEY SEARCH =================

document.addEventListener("keydown", event => {

  if (event.key === "Enter") {

    const active =
      document.activeElement;

    if (
      active &&
      active.id === "searchInput"
    ) {
      performSearch();
    }

  }

});


// ================= SEARCH NOTIFICATIONS =================

function addSearchNotification(query) {

  const notification =
    document.getElementById("notificationList");

  if (!notification) return;

  const item =
    document.createElement("div");

  item.className = "notification";

  item.innerHTML = `
    <strong>Search completed</strong>
    <p>${escapeHTML(query)}</p>
  `;

  notification.prepend(item);
}


// ================= SHORTCUTS =================

function createShortcut() {

  const input =
    document.getElementById("shortcutURL");

  if (!input) return;

  let url = input.value.trim();

  if (!url) return;

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    url = "https://" + url;
  }

  shortcuts.push(url);

  localStorage.setItem(
    "trigonShortcuts",
    JSON.stringify(shortcuts)
  );

  input.value = "";

  renderShortcuts();

  closeModals();

  notify("Shortcut added ∆");
}


function renderShortcuts() {

  const container =
    document.getElementById("shortcutList");

  if (!container) return;

  container.innerHTML = "";

  shortcuts.forEach((url, index) => {

    const card =
      document.createElement("div");

    card.className = "shortcut-card";

    card.innerHTML = `
      <strong>${escapeHTML(
        getDomain(url)
      )}</strong>

      <p>${escapeHTML(url)}</p>

      <button onclick="openShortcut(${index})">
        Open
      </button>

      <button onclick="deleteShortcut(${index})">
        Delete
      </button>
    `;

    container.appendChild(card);

  });
}


function openShortcut(index) {

  if (!shortcuts[index]) return;

  window.open(
    shortcuts[index],
    "_blank"
  );
}


function deleteShortcut(index) {

  shortcuts.splice(index, 1);

  localStorage.setItem(
    "trigonShortcuts",
    JSON.stringify(shortcuts)
  );

  renderShortcuts();
}


// ================= MODES =================

function setMode(mode) {

  if (!modes[mode]) return;

  currentMode = mode;

  document.body.classList.remove(
    "mode-blue",
    "mode-red",
    "mode-custom",
    "mode-trigon",
    "mode-ess"
  );

  document.body.classList.add(
    "mode-" + mode
  );

  localStorage.setItem(
    "trigonMode",
    mode
  );

  notify(
    "Mode changed to " +
    modes[mode].name +
    " ∆"
  );

  updateModeUI();
}


function updateModeUI() {

  document.querySelectorAll(".mode-card")
    .forEach(card => {

      card.classList.remove("selected");

      if (
        card.dataset.mode === currentMode
      ) {
        card.classList.add("selected");
      }

    });
}


// ================= LOAD SAVED MODE =================

function loadSavedMode() {

  const saved =
    localStorage.getItem("trigonMode");

  if (saved && modes[saved]) {
    currentMode = saved;
  }

  document.body.classList.add(
    "mode-" + currentMode
  );

  updateModeUI();
}


// ================= SOUND =================

function playClick() {

  if (!soundEnabled) return;

  try {

    const audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value =
      currentMode === "red"
        ? 260
        : 520;

    gain.gain.setValueAtTime(
      0.04,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.06
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.06
    );

  } catch (error) {
    console.log("Audio unavailable.");
  }
}


// ================= GLOBAL CLICK SOUND =================

document.addEventListener("click", event => {

  if (
    event.target.tagName === "BUTTON" ||
    event.target.classList.contains("browser-tab") ||
    event.target.classList.contains("nav-btn")
  ) {
    playClick();
  }

});


// ================= GLOW =================

function toggleGlow(enabled) {

  glowEnabled = enabled;

  if (enabled) {
    document.body.classList.remove("no-glow");
  } else {
    document.body.classList.add("no-glow");
  }

  localStorage.setItem(
    "trigonGlow",
    enabled
  );
}


// ================= SOUND SETTING =================

function toggleSound(enabled) {

  soundEnabled = enabled;

  localStorage.setItem(
    "trigonSound",
    enabled
  );
}


// ================= ACCOUNT CREATION =================

function createAccountRequest() {

  const email =
    document.getElementById("accountEmail")
      ?.value.trim();

  if (!email) {
    alert("Enter your email first.");
    return;
  }

  const code =
    Math.floor(
      100000 +
      Math.random() * 900000
    );

  localStorage.setItem(
    "trigonPendingCode",
    code
  );

  alert(
    "Your Trigon request code is:\n\n" +
    code +
    "\n\nSend this code to Trigon for manual approval."
  );

  notify("Account request created.");
}


// ================= ADD ACCOUNT =================

function addAccount() {

  const username =
    document.getElementById("newAccountUsername")
      ?.value.trim();

  if (!username) {
    alert("Enter a username.");
    return;
  }

  accounts.push({
    username: username,
    created: Date.now()
  });

  localStorage.setItem(
    "trigonAccounts",
    JSON.stringify(accounts)
  );

  notify(
    "Account added: " +
    username
  );
}


// ================= SWITCH ACCOUNT =================

function switchAccount(username) {

  if (!username) return;

  localStorage.setItem(
    "trigonUsername",
    username
  );

  notify(
    "Switched to " +
    username +
    " ∆"
  );
}


// ================= RECOVERY EMAIL =================

function saveRecoveryEmail() {

  const email =
    document.getElementById("recoveryEmail")
      ?.value.trim();

  if (!email) {
    alert("Enter a recovery email.");
    return;
  }

  localStorage.setItem(
    "trigonRecoveryEmail",
    email
  );

  closeModals();

  notify("Recovery email saved.");
}


// ================= RESET PASSWORD =================

function resetPassword() {

  const password =
    document.getElementById("newPassword")
      ?.value;

  if (!password) {
    alert("Enter a new password.");
    return;
  }

  // Demo only.
  // Real password recovery needs a secure backend.

  localStorage.setItem(
    "trigonDemoPassword",
    password
  );

  closeModals();

  notify(
    "Demo password updated."
  );
}


// ================= TAB COMBINATION =================

function combineTabs() {

  const tabs =
    document.querySelectorAll(
      ".tab-item input[type='checkbox']:checked"
    );

  if (tabs.length < 2) {

    alert(
      "Select at least 2 tabs to combine."
    );

    return;
  }

  notify(
    tabs.length +
    " tabs combined ∆"
  );

  const box =
    document.getElementById(
      "combinationStatus"
    );

  if (box) {
    box.textContent =
      tabs.length +
      " tabs are now grouped.";
  }
}


// ================= PARALLEL TAB =================

function openParallelTab() {

  notify(
    "Parallel Tab opened in defensive mode."
  );

  const alertBox =
    document.getElementById(
      "securityAlert"
    );

  if (alertBox) {
    alertBox.style.display = "block";
  }
}


// ================= SECURITY CHECK =================

function runSecurityCheck() {

  const status =
    document.getElementById(
      "securityStatus"
    );

  if (status) {

    status.textContent =
      "Checking Trigon tabs...";

  }

  setTimeout(() => {

    if (status) {

      status.textContent =
        "No suspicious browser activity detected.";

    }

    notify(
      "Security check complete ∆"
    );

  }, 1000);
}


// ================= QUARANTINE =================

function quarantineTab() {

  notify(
    "Suspicious tab isolated."
  );

  const alertBox =
    document.getElementById(
      "securityAlert"
    );

  if (alertBox) {
    alertBox.style.display = "none";
  }
}


// ================= TRIGON HELPER =================

function runHelper() {

  alert(
    "∆ Trigon Helper\n\n" +
    "If you suspect ransomware or malware:\n\n" +
    "• Disconnect from suspicious websites.\n" +
    "• Do not open unknown downloads.\n" +
    "• Use your device's trusted security software.\n" +
    "• Ask a parent/guardian or trusted adult for help if needed."
  );

}


// ================= TEST CENTER =================

async function runPingTest() {

  const result =
    document.getElementById("pingResult");

  if (!result) return;

  result.textContent =
    "Testing...";

  const start =
    performance.now();

  try {

    await fetch(
      location.href,
      {
        method: "HEAD",
        cache: "no-store"
      }
    );

    const ping =
      Math.round(
        performance.now() - start
      );

    result.textContent =
      ping + " ms";

  } catch {

    result.textContent =
      "Unavailable";

  }
}


// ================= FPS TEST =================

function runFPSTest() {

  const result =
    document.getElementById("fpsResult");

  if (!result) return;

  let frames = 0;
  const start = performance.now();

  function frame() {

    frames++;

    const elapsed =
      performance.now() - start;

    if (elapsed < 1000) {

      requestAnimationFrame(frame);

    } else {

      result.textContent =
        frames + " FPS";

    }

  }

  requestAnimationFrame(frame);
}


// ================= PERFORMANCE TEST =================

function runPerformanceTest() {

  const result =
    document.getElementById(
      "performanceResult"
    );

  if (!result) return;

  result.textContent =
    "Testing...";

  setTimeout(() => {

    const start =
      performance.now();

    let total = 0;

    for (let i = 0; i < 1000000; i++) {
      total += Math.sqrt(i);
    }

    const time =
      Math.round(
        performance.now() - start
      );

    result.textContent =
      time + " ms";

  }, 100);

}


// ================= MODALS =================

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.style.display = "flex";
}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {
    modal.style.display = "none";
  }
}


function closeModals() {

  document.querySelectorAll(".modal")
    .forEach(modal => {
      modal.style.display = "none";
    });

  const alertBox =
    document.getElementById(
      "securityAlert"
    );

  if (alertBox) {
    alertBox.style.display = "none";
  }
}


// ================= NOTIFICATIONS =================

function notify(message) {

  console.log(
    "∆ TRIGON:",
    message
  );

  const list =
    document.getElementById(
      "notificationList"
    );

  if (!list) return;

  const item =
    document.createElement("div");

  item.className =
    "notification";

  item.innerHTML = `
    <strong>Trigon</strong>
    <p>${escapeHTML(message)}</p>
  `;

  list.prepend(item);
}


// ================= TABS =================

function openTab(type) {

  showTabLoading();

  if (type === "google") {
    openGoogle();
    return;
  }

  if (type === "chatgpt") {
    openChatGPT();
    return;
  }

}


// ================= DOMAIN HELPER =================

function getDomain(url) {

  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }

}


// ================= HTML SAFETY =================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ================= MOBILE NAV =================

function mobileNavigate(page) {

  showPage(page);

}


// ================= INITIALIZATION =================

document.addEventListener("DOMContentLoaded", () => {

  loadSavedMode();

  renderShortcuts();

  const savedSound =
    localStorage.getItem("trigonSound");

  if (savedSound !== null) {
    soundEnabled =
      savedSound === "true";
  }

  const savedGlow =
    localStorage.getItem("trigonGlow");

  if (savedGlow !== null) {
    glowEnabled =
      savedGlow === "true";

    toggleGlow(glowEnabled);
  }

  const loggedIn =
    localStorage.getItem(
      "trigonLoggedIn"
    );

  if (loggedIn === "true") {

    const loginScreen =
      document.getElementById(
        "loginScreen"
      );

    const dashboard =
      document.getElementById(
        "dashboard"
      );

    if (loginScreen) {
      loginScreen.style.display = "none";
    }

    if (dashboard) {
      dashboard.style.display = "flex";
    }

  }

});


// ======================================================
// ∆ TRIGON JS INITIALIZED
// ======================================================

console.log(
  "%c∆ TRIGON SYSTEM ONLINE",
  "font-size:20px;font-weight:bold;"
);

console.log(
  "JavaScript: 😈 I HAVE ARRIVED."
);

consle.log(
"creator was here:p."
);
