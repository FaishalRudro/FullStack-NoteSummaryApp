# 📝 AI Notes App

A full-stack AI-powered note-taking application where users can write, organize, and summarize notes using Groq LLaMA AI.

Built with **React**, **FastAPI**, **PostgreSQL**, and **Groq LLaMA 3.3**.

---

## ✨ Features

- 🔐 **Authentication** — Secure Register & Login with JWT
- 📝 **Notes CRUD** — Create, Edit, Delete notes
- 📌 **Pin Notes** — Keep important notes at the top
- 🏷️ **Categories** — General, Work, Personal, Study, Ideas
- 🔍 **Search & Filter** — Find notes instantly
- 🤖 **AI Summary** — Summarize any note with Groq LLaMA
- 📋 **Copy to Clipboard** — One click copy
- 🌙 **Dark Mode** — Easy on the eyes
- 📊 **Word Count & Date** — Track note details

---

## 🛠️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 18 + Vite     |
| Backend    | FastAPI (Python)    |
| Database   | PostgreSQL 17       |
| AI Model   | Groq LLaMA 3.3 70B  |
| Auth       | JWT Token           |
| Styling    | Inline CSS          |

---

## 📁 Project Structure

```
notes-app/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD
├── backend/
│   ├── main.py             # FastAPI routes
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # JWT authentication
│   ├── database.py         # DB connection
│   ├── test_main.py        # API tests
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Notes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 17
- Groq API Key — [console.groq.com](https://console.groq.com)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/notes-app.git
cd notes-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Create `.env` file** (copy from `.env.example`):

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/notesapp
SECRET_KEY=your-secret-key-make-it-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GROQ_API_KEY=your_groq_api_key
```

**Create the database:**

```bash
psql -U postgres -c "CREATE DATABASE notesapp;"
```

**Run the backend:**

```bash
uvicorn main:app --reload
```

✅ Backend running at: `http://localhost:8000`
📄 API Docs at: `http://localhost:8000/docs`

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method   | Endpoint                   | Description          | Auth Required |
|----------|----------------------------|----------------------|---------------|
| `POST`   | `/auth/register`           | Register new user    | ❌            |
| `POST`   | `/auth/login`              | Login & get token    | ❌            |
| `GET`    | `/notes`                   | Get all notes        | ✅            |
| `POST`   | `/notes`                   | Create a note        | ✅            |
| `PUT`    | `/notes/{id}`              | Update a note        | ✅            |
| `DELETE` | `/notes/{id}`              | Delete a note        | ✅            |
| `POST`   | `/notes/{id}/summarize`    | AI summarize note    | ✅            |

---

## ⚙️ CI/CD

This project uses **GitHub Actions** for continuous integration.

On every push to `main`:

- ✅ Backend tests run with PostgreSQL service
- ✅ Frontend builds successfully
- ✅ Build artifacts uploaded

---

## 🔐 Environment Variables

| Variable                     | Description                        |
|------------------------------|------------------------------------|
| `DATABASE_URL`               | PostgreSQL connection string       |
| `SECRET_KEY`                 | JWT signing secret                 |
| `ALGORITHM`                  | JWT algorithm (HS256)              |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| Token expiry time in minutes       |
| `GROQ_API_KEY`               | Groq API key for LLaMA model       |

---

## 🧪 Running Tests

```bash
cd backend
pytest test_main.py -v
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Rudro** — [@your-github](https://github.com/your-username)

---

## 📄 License

This project is licensed under the MIT License.