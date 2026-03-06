# ⬡ Market Mirror AI

> **Smart Retail Intelligence for the Modern Seller**  
> A decoupled full-stack platform. Backend in **FastAPI** + Frontend in **Vite & React**.

---

## 📁 Project Structure

```
Market mirror/
├── backend/                  # FastAPI Backend API
│   ├── market_mirror/
│   │   ├── main.py           # Entry point (CORS + Routers)
│   │   ├── database.py       # SQLite database setup
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── crud.py           # DB logic
│   │   ├── simulator.py      # AI Mock logic
│   │   └── routers/          # API endpoint routes
│   └── requirements.txt      # Backend dependencies
├── frontend/                 # React Frontend App
│   ├── index.html            
│   ├── vite.config.js        # Vite config (proxies /api to backend)
│   ├── package.json          
│   └── src/
│       ├── main.jsx          # React entry
│       ├── App.jsx           # Root layout / State
│       ├── index.css         # Tailwind & UI animations
│       ├── api.js            # Axios/Fetch API layer
│       └── components/       # UI modular components
└── README.md
```

---

## 🚀 Setup & Run

You need to run **both** the backend and the frontend in separate terminal windows.

### 🔌 1. Backend Setup & Run

Open **Terminal 1**:

```powershell
cd "c:\Users\KaviPriya\Desktop\Market mirror\backend"

# Create & activate venv
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn market_mirror.main:app --host 127.0.0.1 --port 8000 --reload
```

*API Docs available at: `http://127.0.0.1:8000/docs`*

---

### 🌐 2. Frontend Setup & Run

Open **Terminal 2**:

```powershell
cd "c:\Users\KaviPriya\Desktop\Market mirror\frontend"

# Install dependencies
npm install

# Run the Vite dev server
npm run dev
```

The frontend will run on **`http://localhost:5173`**. Open this in your browser.

> **Note:** The frontend automatically proxies all `/api` requests to `http://127.0.0.1:8000`, so no hardcoded URLs are needed.

---

## 🔌 API Endpoints (Backend)

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

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Address already in use` or `[WinError 10013]` on port 8000 | Port is already occupied. Find and kill it: `netstat -ano \| findstr :8000` → then `taskkill /PID <PID> /F`. Or use a different port. |
| React not loading data | Ensure your backend is running on port 8000 simultaneously. |
| `vite` command not found | Run `npm install` inside the `frontend/` folder first. |
