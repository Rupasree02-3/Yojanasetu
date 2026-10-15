# YojanaSetu: Unified Government Scheme Finder Portal

Many citizens never claim government schemes they qualify for because eligibility rules are spread across hundreds of confusing websites and official documents. **YojanaSetu** solves this problem by acting as a smart, centralized microservice engine that matches citizens with qualifying Central and State government schemes through a simple 6-filter matching engine.

---

## 🚀 Live Hosted Links
* **Live Hosted Web MVP App:** https://vercel.app
* **Production API Service Documentation:** https://onrender.com

---

## ✨ Core Features
* **6-Layer Dynamic Filtering Engine:** Users filter matches in real-time based on Search Keywords, State, Age-Group, Occupation, and Income Parameters.
* **Persistent SQL Storage Layer:** All application submissions and verification updates are securely stored using SQLite.
* **Dual Workspace Dashboards:** 
  * **Citizen Hub:** Fill out digital registration forms and track application lifecycle statuses securely.
  * **District Verification Officer Desk:** DVO desks review, filter by district, and run real-time "Approve" or "Reject" mutations with custom remarks.
* **Reliable Offline Fallback Mode:** The JavaScript engine contains a native matching fallback structure that ensures the UI functions cleanly even if the cloud backend experiences latency or downtime.

---

## 🏛️ Project Architecture
The application splits static client assets from data processing routines to maximize deployment efficiency:

```text
Yojanasetu/
│
├── frontend/               # Hosted on Vercel
│   ├── index.html          # Semantic HTML5 Layout Architecture
│   ├── style.css           # Modular, Responsive UX CSS Stylesheet
│   └── script.js           # API Connector and UI DOM Manipulation Engine
│
└── backend/                # Hosted on Render
    └── app/
        ├── main.py         # App Bootstrap, CORS Setup, and Router Assembly
        ├── database.py     # SQLite SQLAlchemy Connection Configuration
        ├── models.py       # SQLAlchemy ORM Database Table Schemas
        ├── schemas.py      # Pydantic Structural Request/Response Validators
        └── routes.py       # API Route Controllers & Lazy-Seeding Logic
```

---

## 🛠️ Local Installation & Setup

### Prerequisites
* Python 3.9 or higher installed on your system.
* Node.js / VS Code Live Server extension for frontend hosting.

### 1. Backend API Configuration
Navigate to your backend directory and configure the Python virtual workspace:
```bash
# Move to the app package directory
cd backend/app

# Install all production library dependencies
pip install fastapi uvicorn sqlalchemy pydantic

# Start the live development ASGI server
python -m uvicorn main:app --reload --port 8000
```
Once initialized, visit **`http://127.0.0`** to open the interactive Swagger UI and verify that all endpoints are live.

### 2. Frontend Interface Launch
* Open the `frontend` folder inside your code editor.
* Ensure the active API endpoint URLs inside `frontend/script.js` point to your running backend (`http://127.0.0.1:8000`).
* Click **Go Live** on the bottom right taskbar of VS Code to launch the website via Live Server (`http://127.0.0`).

---

## 📡 Core API Endpoints Reference

### Schemes Matrix Logic
* **`POST /api/schemes/filter`** - Evaluates dynamic multi-layered consumer criteria parameters against active database rows to return customized list matrices.
* **`GET /api/schemes`** - Pulls a complete collection of all central and state welfare scheme configurations.

### Application Processing Lifecycle
* **`GET /api/applications?district=All`** - Fetches all filed citizen records ordered chronologically with an optional district filtering toggle.
* **`POST /api/applications`** - Registers a new user scheme profile submission into the SQLite database.
* **`PATCH /api/applications/{app_id}/verify`** - Allows District Verification Officers to alter application state columns (`Approved` / `Rejected`) live from the admin panel desk.

---

## 🛡️ Built With
* **Frontend:** Vanilla JavaScript (ES6+ Runtime Core), HTML5 Elements, Custom Semantic CSS Variables.
* **Backend:** FastAPI (Python ASGI Async Microservice Framework).
* **Database:** SQLite managed via SQLAlchemy Object Relational Mapping (ORM) models.
