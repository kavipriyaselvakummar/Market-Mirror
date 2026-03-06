# ⬡ Market Mirror AI

> **Smart Retail Intelligence for the Modern Seller**  
> A full-stack AI-powered pricing intelligence platform built with **FastAPI** (backend) + **Jinja2 / HTML** (frontend).

---

## 📁 Project Structure

```
Market mirror/
├── market_mirror/
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # SQLite database setup (SQLAlchemy)
│   ├── models.py             # Database models
│   ├── schemas.py            # Pydantic schemas
│   ├── crud.py               # Database CRUD operations
│   ├── simulator.py          # Market data simulator
│   ├── requirements.txt      # Python dependencies
│   ├── routers/
│   │   ├── products.py       # Product management API
│   │   ├── prices.py         # Competitor price API
│   │   ├── demand.py         # Demand analytics API
│   │   ├── trends.py         # Price trend API
│   │   ├── recommendations.py# AI pricing recommendation API
│   │   ├── alerts.py         # Price alert API
│   │   ├── risk.py           # Competition risk API
│   │   └── query.py          # Market intelligence Q&A API
│   ├── templates/
│   │   └── index.html        # Single-page frontend (served by FastAPI)
│   └── static/               # Static assets (CSS, JS, images)
├── market_mirror.db          # SQLite database (auto-created on first run)
└── README.md
```

> **Note:** This project has **no separate frontend build step**. The HTML/CSS/JS frontend is a Jinja2 template served directly by the FastAPI backend. You only need to run the backend server.

---

## ⚙️ Prerequisites

| Requirement | Version |
|-------------|---------|
| Python      | 3.9+    |
| pip         | Latest  |

---

## 🚀 Setup & Run

### Step 1 — Clone / Open the Project

Open a terminal (PowerShell or CMD) and navigate to the project root:

```powershell
cd "c:\Users\KaviPriya\Desktop\Market mirror"
```

---

### Step 2 — Create a Virtual Environment (Recommended)

```powershell
python -m venv venv
```

**Activate it:**

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat
```

> 💡 You should see `(venv)` in your terminal prompt once activated.

---

### Step 3 — Install Dependencies

```powershell
pip install -r market_mirror\requirements.txt
```

This installs:
- `fastapi` — Web framework
- `uvicorn` — ASGI server
- `sqlalchemy` — ORM / database layer
- `pydantic` — Data validation
- `python-multipart` — Form data support
- `jinja2` — HTML template engine

---

### Step 4 — Run the Backend Server

```powershell
uvicorn market_mirror.main:app --host 127.0.0.1 --port 8000
```

**Options:**

| Option | Description |
|--------|-------------|
| `--host 127.0.0.1` | Bind to localhost only |
| `--host 0.0.0.0` | Expose on your local network |
| `--port 8000` | Port to listen on (change if needed) |
| `--reload` | Auto-reload on code changes (development) |

**Development mode (with auto-reload):**

```powershell
uvicorn market_mirror.main:app --host 127.0.0.1 --port 8000 --reload
```

---

### Step 5 — Open the App

Once the server is running, open your browser and go to:

```
http://127.0.0.1:8000
```

The frontend UI (Market Mirror AI dashboard) will load automatically. ✅

---

## 🌐 Frontend

The frontend is **built into the backend** — no separate install or build process needed.

| What it is | Details |
|------------|---------|
| Type | Single-page HTML app (Jinja2 template) |
| Location | `market_mirror/templates/index.html` |
| Served at | `http://127.0.0.1:8000/` |
| Libraries used | Tailwind CSS (CDN), Chart.js (CDN), Google Fonts (CDN) |
| Runs separately? | ❌ No — served by FastAPI, no build step |

---

## 🔌 Backend API Endpoints

All API routes are prefixed with `/api`. Interactive docs available at:

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

| Router | Endpoint Prefix | Description |
|--------|----------------|-------------|
| Products | `/api/products` | Add / retrieve products |
| Prices | `/api/prices` | Competitor price comparison |
| Demand | `/api/demand` | Demand analytics & metrics |
| Trends | `/api/trends` | 7-day price trend analysis |
| Recommendations | `/api/recommendations` | AI-powered pricing suggestion |
| Alerts | `/api/alerts` | Critical market alerts |
| Risk | `/api/risk` | Competition risk assessment |
| Query | `/api/query` | Market intelligence Q&A |

---

## 🗄️ Database

- **Engine:** SQLite (file-based, zero-config)
- **File:** `market_mirror.db` (auto-created at project root on first run)
- **ORM:** SQLAlchemy

To **reset the database**, simply delete `market_mirror.db` and restart the server:

```powershell
Remove-Item market_mirror.db
uvicorn market_mirror.main:app --host 127.0.0.1 --port 8000
```

---

## 🔄 Quick Reference — All Commands

```powershell
# 1. Navigate to project
cd "c:\Users\KaviPriya\Desktop\Market mirror"

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# 4. Install dependencies
pip install -r market_mirror\requirements.txt

# 5a. Run server (production-like)
uvicorn market_mirror.main:app --host 127.0.0.1 --port 8000

# 5b. Run server (development with auto-reload)
uvicorn market_mirror.main:app --host 127.0.0.1 --port 8000 --reload

# 6. Open app in browser
start http://127.0.0.1:8000

# 7. View API docs in browser
start http://127.0.0.1:8000/docs
```

---

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal where uvicorn is running.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` for any package | Run `pip install -r market_mirror\requirements.txt` |
| `Address already in use` or `[WinError 10013]` on port 8000 | Port is already occupied. Find and kill it: `netstat -ano \| findstr :8000` → then `taskkill /PID <PID> /F`. Or use a different port: `--port 8001` |
| PowerShell `Activate.ps1` blocked | Run: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Page shows error after form submit | Ensure the server is running and visit `http://127.0.0.1:8000/docs` to check the API |
| Database errors | Delete `market_mirror.db` and restart the server |

---

## 📝 Notes

- The SQLite database (`market_mirror.db`) is created automatically on first run — no manual setup needed.
- Market data (competitor prices, demand metrics, trends) is **AI-simulated** via `simulator.py` for demonstration purposes.
- CORS is open (`allow_origins=["*"]`) — restrict this before deploying to production.
