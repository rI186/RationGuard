// ============================================================
//  RationGuard — app.js
// ============================================================

// ── PAGE NAVIGATION ──────────────────────────────────────────
function gotoPage(p) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');

  document.querySelectorAll('.nb').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(p)) {
      btn.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── SHOPKEEPER LOGIN ─────────────────────────────────────────
function skLogin() {
  const id = document.getElementById('sk-id').value.trim();
  const pw = document.getElementById('sk-pw').value.trim();
  const errEl = document.getElementById('sk-err');

  if (!errEl) return console.error("sk-err missing in HTML");

  if (!id || !pw) {
    errEl.textContent = 'Please enter both Shop ID and password.';
    errEl.style.display = 'block';
    return;
  }

  fetch('http://localhost:3000/api/auth/shopkeeper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopId: id, password: pw })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        loginSuccessSK();
      } else {
        errEl.textContent = data.message || 'Login failed.';
        errEl.style.display = 'block';
      }
    })
    .catch(err => {
      console.error(err);
      errEl.textContent = 'Server error';
      errEl.style.display = 'block';
    });
}

function loginSuccessSK() {
  const err = document.getElementById('sk-err');
  const login = document.getElementById('sk-login');
  const dash = document.getElementById('sk-dash');

  if (!err || !login || !dash) return;

  err.style.display = 'none';
  login.style.display = 'none';
  dash.style.display = 'block';

}

function skLogout() {
  document.getElementById('sk-login').style.display = 'block';
  document.getElementById('sk-dash').style.display = 'none';
}

// ── CARD TYPE ────────────────────────────────────────────────
function showCT(type, btn) {
  ['yellow', 'white', 'orange'].forEach(t => {
    const el = document.getElementById('ct-' + t);
    if (el) el.style.display = t === type ? 'block' : 'none';
  });

  document.querySelectorAll('.ct-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// ── TOGGLE TABLE ─────────────────────────────────────────────
function togT(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const isOpen = el.style.display === 'block';

  document.querySelectorAll('[id^="ty"],[id^="tw"],[id^="to"]').forEach(t => {
    t.style.display = 'none';
  });

  el.style.display = isOpen ? 'none' : 'block';
}

// ── USER LOGIN ───────────────────────────────────────────────
function uLogin() {
  const c = document.getElementById('u-card').value.trim();
  const p = document.getElementById('u-pw').value.trim();
  const errEl = document.getElementById('u-err');

  if (!errEl) return console.error("u-err missing in HTML");

  if (!c || !p) {
    errEl.textContent = 'Enter card number and password.';
    errEl.style.display = 'block';
    return;
  }

  fetch('http://localhost:3000/api/auth/beneficiary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardNumber: c, password: p })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        loginSuccessUser();
      } else {
        errEl.textContent = data.message || 'Login failed.';
        errEl.style.display = 'block';
      }
    })
    .catch(err => {
      console.error(err);
      errEl.textContent = 'Server error';
      errEl.style.display = 'block';
    });
}

function loginSuccessUser() {
  const err = document.getElementById('u-err');
  const login = document.getElementById('u-login');
  const dash = document.getElementById('u-dash');
  const c = document.getElementById('u-card').value;

  localStorage.setItem("cardNumber", c);

  if (!err || !login || !dash) return;

  err.style.display = 'none';
  login.style.display = 'none';
  dash.style.display = 'block';

  // 🔥 START AUTO REFRESH ONLY AFTER LOGIN
  loadCardStatus();
  loadMembers();
  loadNotifications();

  setInterval(loadCardStatus, 2000);
  setInterval(loadNotifications, 3000);
  setInterval(loadMembers, 3000);
}

function uLogout() {
  document.getElementById('u-login').style.display = 'block';
  document.getElementById('u-dash').style.display = 'none';
}

// ── ADD MEMBER ───────────────────────────────────────────────
function addMember() {
  const name = document.getElementById('member-name').value;
  const dob = document.getElementById('member-dob').value;
  const gender = document.getElementById('member-gender').value;
  const relation = document.getElementById('member-relation').value;
  const aadhaar = document.getElementById('member-aadhaar').value;

  const cardNumber = localStorage.getItem("cardNumber");

  // ✅ basic validation
  if (!name || !dob || !aadhaar) {
    alert("Please fill all required fields");
    return;
  }

  fetch('http://localhost:3000/api/cards/members/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cardNumber,
      name,
      dob,
      gender,
      relation,
      aadhaar
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('add-modal').classList.remove('open');
        alert("✅ Member added successfully");
        loadMembers();
      } else {
        alert(data.message || "Error adding member");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
}

// ── MODAL CLOSE ──────────────────────────────────────────────
function closeM(e) {
  if (e.target === document.getElementById('add-modal')) {
    document.getElementById('add-modal').classList.remove('open');
  }
}

// ── ALERT SUBMIT ─────────────────────────────────────────────
function submitAlert() {
  const nameEl = document.getElementById('alert-name');
  const aadhaarEl = document.getElementById('alert-aadhaar');
  const cardEl = document.getElementById('alert-card');

  const name = nameEl ? nameEl.value.trim() : "";
  const aadhaar = aadhaarEl ? aadhaarEl.value.trim() : "";
  const card = cardEl ? cardEl.value.trim() : "";

  // ❌ if aadhaar field not present, skip it
  if (!name || !card) {
    alert("Fill all required fields");
    return;
  }

  if (aadhaar && !/^\d{12}$/.test(aadhaar)) {
    alert("Invalid Aadhaar number");
    return;
  }

  fetch('http://localhost:3000/api/alerts/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      aadhaar, // will be "" if not present
      cardNumber: card
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Alert submitted");

        if (nameEl) nameEl.value = "";
        if (aadhaarEl) aadhaarEl.value = "";
        if (cardEl) cardEl.value = "";

      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Server error');
    });
}

function showAlertsPopup() {
  fetch('http://localhost:3000/api/alerts/all') // ✅ ALWAYS FULL URL
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById('popup-alert-list');
      box.innerHTML = '';

      const alerts = data.alerts || [];

      if (alerts.length === 0) {
        box.innerHTML = '<p>No alerts available</p>';
        return;
      }

      alerts.forEach(a => {
        box.innerHTML += `
          <div class="popup-alert-card">
            <div class="popup-name"
                onclick="openAlertDetail('${a._id}')"
                style="cursor:pointer;font-weight:600;">
              ${a.name}
            </div>
            <div style="font-size:12px;color:#666;">
              Card: ${a.cardNumber}
            </div>
          </div>
        `;
      });

      document.getElementById('alertsPopup').style.display = 'flex';
    })
    .catch(err => console.error(err));
}


function closeAlertsPopup() {
  document.getElementById('alertsPopup').style.display = 'none';
}

function loadCardStatus() {
  const cardNumber = localStorage.getItem("cardNumber");

  fetch(`http://localhost:3000/api/alerts/card/${cardNumber}`) // ✅ FIXED
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById("cardMessage");
      if (!el) return;

      if (data.isBlocked) {
        el.innerHTML = `❌ <b style="color:red;">CARD BLOCKED</b>`;
      } else {
        el.innerHTML = `✅ <b style="color:green;">CARD ACTIVE</b>`;
      }
    })
    .catch(err => console.error(err));
}

function openAlertDetail(id) {
  fetch(`http://localhost:3000/api/alerts/id/${id}`)
    .then(res => res.json())
    .then(data => {
      const a = data.alert;

      if (!a) {
        alert("Alert not found");
        return;
      }

      const box = document.getElementById("alertDetailBox");

      // 🔥 LEVEL COLOR
      const level = a.count || 1;

      const levelColor =
        level == 3 ? '#ef4444' :
          level == 2 ? '#f59e0b' :
            '#eab308';

      // ⏳ NEXT ALERT CALC (6 days)
      const today = new Date();
      const last = new Date(a.lastSentAt || a.createdAt);
      const next = new Date(last.getTime() + (6 * 24 * 60 * 60 * 1000));

      const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

      const nextText =
        diff <= 0 ? "Today" :
          diff === 1 ? "Tomorrow" :
            `${diff} days`;

      // 🚫 BUTTON STATE
      const isDisabled = a.status === "verified";

      box.innerHTML = `
        <h3 style="margin-bottom:10px;">${a.name}</h3>

        <p><b>Aadhaar:</b> ${a.aadhaar}</p>
        <p><b>Card:</b> ${a.cardNumber}</p>

        <!-- 🔥 ALERT LEVEL -->
        <div style="
          display:inline-block;
          padding:6px 12px;
          border-radius:20px;
          background:${levelColor};
          color:white;
          font-size:12px;
          font-weight:600;
          margin-top:10px;
        ">
          Alert Level: ${level} / 3
        </div>

        <!-- ⏳ NEXT ALERT -->
        <div style="margin-top:10px;color:#555;font-size:13px;">
          Next Alert: <b>${nextText}</b>
        </div>

        <!-- ✅ ACTION BUTTON -->
        <button
        id="verifyBtn"
          style="
            margin-top:15px;
            width:100%;
            padding:10px;
            border:none;
            border-radius:8px;
            background:${isDisabled ? '#9ca3af' : '#111827'};
            color:white;
            cursor:${isDisabled ? 'not-allowed' : 'pointer'};
          "
          onclick="verifyAlert('${a._id}', '${a.aadhaar}', '${a.cardNumber}')"
          ${isDisabled ? 'disabled' : ''}
        >
          ${isDisabled ? 'Already Verified' : 'Take Action'}
        </button>
      `;

      document.getElementById("alertDetailPopup").style.display = "flex";
      console.log(data);
    })
    .catch(err => console.error("DETAIL ERROR:", err));
}

function verifyAlert(alertId, aadhaar, cardNumber) {
  const btn = document.getElementById("verifyBtn");

  fetch(`http://localhost:3000/api/cards/card/${cardNumber}`)
    .then(res => res.json())
    .then(data => {
      const members = data.card?.members || [];

      const match = members.find(m => m.aadhaar === aadhaar);

      if (!match) {
        alert("❌ Aadhaar not found in this ration card");
        return;
      }

      // ✅ MATCH FOUND → call backend
      fetch('http://localhost:3000/api/alerts/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      })
        .then(res => res.json())
        .then(d => {
          if (d.success) {
            alert("✅ Verified");

            // ✅ DISABLE BUTTON
            btn.innerText = "Verified";
            btn.disabled = true;
            btn.style.background = "#aaa";
            btn.style.cursor = "not-allowed";

          } else {
            alert(d.message);
          }
        });
    });
}
function closeAlertDetail() {
  document.getElementById("alertDetailPopup").style.display = "none";
}

function refreshAlerts() {
  fetch('http://localhost:3000/api/alerts/all')
    .then(res => res.json())
    .then(data => {
      console.log("Auto refreshed alerts", data);

      // 👉 OPTIONAL: if popup is open, reload it
      const popup = document.getElementById('alertsPopup');

      if (popup && popup.style.display === 'flex') {
        showAlertsPopup(); // reload UI
      }
    })
    .catch(err => console.error(err));
}

function loadMembers() {
  const cardNumber = localStorage.getItem("cardNumber");
  if (!cardNumber) return; // 🚫 FIX

  fetch(`http://localhost:3000/api/cards/card/${cardNumber}`)
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("membersContainer");
      const totalBox = document.getElementById("totalBox");

      box.innerHTML = "";

      let totalKg = 0;

      const members = data.card?.members || [];
      const alerts = data.card?.alerts || [];

      members.forEach(m => {
        let kg = m.age >= 18 ? 8 : 5;
        if (m.age >= 60) kg = 6;

        totalKg += kg;

        const initials = m.name.split(" ").map(x => x[0]).join("");
        const alert = alerts.find(a => a.aadhaar === m.aadhaar);

        let badge = "";
        let bg = "";

        if (alert) {
          const level = alert.count;

          if (level === 1) bg = "#fef9c3";
          if (level === 2) bg = "#fde68a";
          if (level === 3) bg = "#fecaca";

          badge = `<div style="font-size:11px;padding:3px 8px;border-radius:12px;background:#111;color:white;margin-top:4px;display:inline-block;">Alert ${level}/3</div>`;
        }

        box.innerHTML += `
          <div class="mr" style="background:${bg}">
            <div class="mr-l">
              <div class="mr-av">${initials}</div>
              <div>
                <div class="mr-n">${m.name}</div>
                <div class="mr-a">${m.age} yrs · ${m.relation}</div>
                ${badge}
              </div>
            </div>
            <div class="mr-r">
              <div class="mr-kg">${kg} kg</div>
              <div class="mr-d">Auto calculated</div>
            </div>
          </div>
        `;
      });

      totalBox.innerHTML = `
        <span style="font-weight:700;font-size:.88rem;">Total Monthly Quota</span>
        <div style="text-align:right;">
          <div style="font-size:1.5rem;font-weight:900;color:var(--saffron);">
            ${totalKg} kg
          </div>
          <div style="font-size:.7rem;color:var(--muted);">
            for ${members.length} members
          </div>
        </div>
      `;
    })
    .catch(err => console.error(err));
}

function loadNotifications() {
  const cardNumber = localStorage.getItem("cardNumber");
  if (!cardNumber) return; // 🚫 FIX

  fetch(`http://localhost:3000/api/alerts/card/${cardNumber}`)
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("notificationBox");
      if (!box) return;

      box.innerHTML = "";

      const alerts = data.alerts || [];

      if (alerts.length === 0) {
        box.innerHTML = "<p>No alerts</p>";
        return;
      }

      alerts.forEach(a => {
        const level = a.count || 1;

        const color =
          level == 3 ? "#ef4444" :
          level == 2 ? "#f59e0b" :
          "#eab308";

        const last = new Date(a.lastSentAt || a.createdAt);
        const next = new Date(last.getTime() + (6 * 24 * 60 * 60 * 1000));

        const diff = Math.ceil((next - new Date()) / (1000 * 60 * 60 * 24));

        const nextText =
          diff <= 0 ? "Today" :
          diff === 1 ? "Tomorrow" :
          `${diff} days`;

        box.innerHTML += `
          <div class="ni">
            <span class="ni-ico">⚠️</span>
            <div>
              <div class="ni-t" style="color:${color}">
                ${a.name} — Alert Level ${level}/3
              </div>
              <div class="ni-d">
                Aadhaar: ${a.aadhaar}
              </div>
              <div class="ni-tm">
                Last: ${last.toLocaleDateString()}
              </div>
              <div class="ni-tm">
                Next: ${nextText}
              </div>
            </div>
          </div>
        `;
      });
    })
    .catch(err => console.error(err));
}


window.onload = () => {
  loadCardStatus();
  loadMembers();
  loadNotifications();

  setInterval(loadCardStatus, 2000);
  setInterval(refreshAlerts, 5000);
  setInterval(loadNotifications, 3000); // ✅ ADD THIS
  setInterval(loadMembers, 3000);
};  