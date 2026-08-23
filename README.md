# ☕ CoffeeHub

CoffeeHub is a backend REST API application built using FastAPI and PostgreSQL.
It provides authentication and CRUD operations for managing customers, admins,
and coffee products.

## 🚀 Features

- JWT-based authentication
- Password hashing using bcrypt
- Customer management
- Admin authentication and management
- Coffee CRUD operations
- PostgreSQL database integration
- SQLAlchemy ORM
- Environment variable based configuration
- Automatic API documentation with Swagger UI
- Protected API endpoints

## 🛠️ Tech Stack

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Psycopg2
- JWT
- Passlib / Bcrypt
- Pydantic
- Uvicorn
- python-dotenv

## 📁 Project Structure

```text
coffeehub/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   └── connection.py
│   │   │
│   │   ├── models/
│   │   │   └── coffee.py
│   │   │
│   │   ├── routes/
│   │   │   └── coffee.py
│   │   │
│   │   ├── schemas/
│   │   │   └── coffee.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── .gitignore
└── README.md