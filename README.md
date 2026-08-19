# 🌾 RationGuard
### Smart PDS Fraud Prevention System
**Integrates the Civil Death Registry with the PDS Beneficiary Database**
> SDG-2 Zero Hunger · AISSMS IOIT · B.Tech IT 2024–2028

---

## 📁 Project Structure

```
rationguard/
│
├── index.html      ← All HTML (3 pages: Home, Shopkeeper, Beneficiary)
├── style.css       ← All CSS styles and design
├── app.js          ← Frontend JavaScript (navigation, login, interactions)
├── server.js       ← Node.js + Express backend (API routes, simulated DB)
├── package.json    ← Node.js project config and dependencies
└── README.md       ← This file
```

---

## 🚀 How to Run

### Option A — With Node.js Backend (Full Stack)

1. Make sure [Node.js](https://nodejs.org) is installed on your system.

2. Open a terminal inside the `rationguard/` folder.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

### Option B — Frontend Only (No Backend)

Just open `index.html` directly in any browser.
Login will still work using the built-in fallback in `app.js`.

---

## 🔑 Demo Login Credentials

| Portal | Field | Value |
|---|---|---|
| **Shopkeeper** | Shop ID | `MH-PUNE-0047` |
| **Shopkeeper** | Password | `shop@2026` |
| **Beneficiary** | Ration Card | `MH-2201-Y` |
| **Beneficiary** | Password | `anand@2026` |

---

## 🌐 API Endpoints (Backend)

| Method | Route | Description |
|---|---|---|
| POST | `/api/login/shopkeeper` | Shopkeeper login |
| POST | `/api/login/beneficiary` | Beneficiary login |
| GET | `/api/cards/:shopId` | Get all ration cards for a shop |
| GET | `/api/card/:cardNumber` | Get single card details |
| GET | `/api/alerts` | Get all active death alerts |
| GET | `/api/alerts/:cardNumber` | Get alerts for a card |
| POST | `/api/members/add` | Submit add-member request |
| GET | `/api/ration-policy` | Get age-based ration rules |

---

## 💡 How the Death Alert System Works

The system is **fully automatic** — no family or shopkeeper submits alerts.

1. **NDR Query** — Every midnight, RationGuard queries the National Death Register (NDR).
2. **Match** — Deceased person's Name + DOB + City + State + Aadhaar are fuzzy-matched against PDS records.
3. **Alert #1** — If match confidence ≥ 80%, Alert #1 is raised. Shopkeeper and family are notified.
4. **Alert #2** — After 7 days unresolved, Alert #2 is issued. Ration share is withheld at FPS.
5. **Alert #3** — Final warning. Family has 7 more days to dispute.
6. **Auto-Block** — After 3 unresolved alerts, the member is permanently blocked in the PDS database.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend HTML | `index.html` |
| Frontend CSS | `style.css` |
| Frontend JS | `app.js` |
| Backend | Node.js + Express (`server.js`) |
| Database (demo) | Simulated in-memory data in `server.js` |
| Fonts | Google Fonts (Playfair Display, DM Sans, DM Mono) |

---

## 👩‍💻 Developed By

**Swamini** — B.Tech IT, AISSMS IOIT, Pune (2024–2028 Batch)

Project aligned with **UN SDG-2: Zero Hunger**
