# Telecom App

React + FastAPI telecom dashboard with a MySQL-backed wallet, plan, top-up flow, and eSIM activation flow.

## Stack

- Frontend: React, Vite
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: MySQL

## Project Structure

```text
app/
  api/routes/
  core/
  models/
  schemas/
  services/
src/
  components/
  context/
  pages/
  services/
```

## Environment Setup

Copy `.env.example` to `.env` and update the values for your machine.

```env
APP_ENV=development
API_HOST=127.0.0.1
API_PORT=8001
ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
SELFIE_MAX_SIZE_BYTES=5242880
DATABASE_URL=mysql+pymysql://telecom_app:TelecomApp!2026@localhost:3306/telecom_db
VITE_API_BASE_URL=http://127.0.0.1:8001
```

You can also skip `DATABASE_URL` and set:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=telecom_app
DB_PASSWORD=TelecomApp!2026
DB_NAME=telecom_db
```

## Database Setup With XAMPP

1. Start MySQL from XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Run the following SQL:

```sql
CREATE DATABASE IF NOT EXISTS telecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'telecom_app'@'localhost' IDENTIFIED BY 'TelecomApp!2026';
GRANT ALL PRIVILEGES ON telecom_db.* TO 'telecom_app'@'localhost';

CREATE USER IF NOT EXISTS 'telecom_app'@'127.0.0.1' IDENTIFIED BY 'TelecomApp!2026';
GRANT ALL PRIVILEGES ON telecom_db.* TO 'telecom_app'@'127.0.0.1';

FLUSH PRIVILEGES;
```

## Install

Backend dependencies:

```powershell
& "C:\Users\AlaAl\AppData\Local\Programs\Python\Python311\python.exe" -m pip install -r requirements.txt
```

Frontend dependencies:

```powershell
npm install
```

Optional test dependencies:

```powershell
& "C:\Users\AlaAl\AppData\Local\Programs\Python\Python311\python.exe" -m pip install -r requirements-dev.txt
```

## Run

Backend:

```powershell
& "C:\Users\AlaAl\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Production-style backend run:

```powershell
& "C:\Users\AlaAl\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

Frontend:

```powershell
npm run dev
```

## API Endpoints

- `GET /wallet`
- `GET /plan`
- `GET /usage`
- `POST /topup`
- `POST /activate-esim`
- `GET /health`

Swagger docs are available at `http://127.0.0.1:8001/docs`.

## Testing

Run backend tests:

```powershell
& "C:\Users\AlaAl\AppData\Local\Programs\Python\Python311\python.exe" -m pytest
```

The tests use SQLite and do not require MySQL.

## Common Issues

- `1044 Access denied`: the MySQL user exists but does not have privileges on `telecom_db`.
- `1045 Access denied`: the username or password in `.env` is wrong.
- Port `3306` conflicts: stop MAMP MySQL if you want to use XAMPP MySQL.
- Frontend cannot reach backend: verify `VITE_API_BASE_URL` matches the FastAPI server URL.
