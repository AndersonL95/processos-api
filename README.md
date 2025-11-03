# 🧩 Processos API

**Processos API** is a backend application developed with **Node.js**, **Express**, and **TypeORM**, designed to manage internal processes and serve as the backend for the **Processos App**.
The system centralizes and automates administrative workflows, providing secure and scalable endpoints for internal consumption.

---

## 🚀 Main Technologies

* **Node.js** – JavaScript runtime
* **Express** – Minimalist framework for building RESTful APIs
* **TypeORM** – ORM for relational database integration
* **PostgreSQL** – Primary database
* **JWT Authentication** – Token-based authentication system
* **Multer / Upload Handling** – File and attachment management
* **Dotenv** – Environment variable configuration

---

## ⚙️ Key Features

* Create, update, and list **internal processes**
* User management and **role-based permissions**
* File and document upload management
* Direct integration with the **Processos App (Flutter)**
* Centralized logging and validation
* Modular and scalable architecture for new features

---

## 📁 Project Structure (Summary)

```
processos-api/
├── src/
│   ├── modules/          # Application modules (processes, users, etc.)
│   ├── config/           # Database and environment configurations
│   ├── middlewares/      # Global middlewares
│   ├── entities/         # TypeORM entities
│   ├── routes/           # API route definitions
│   └── index.ts          # Main entry point
├── .env.example          # Environment variable example
├── package.json
└── tsconfig.json
```

---

## 🧠 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/AndersonL95/processos-api.git
cd processos-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run migrations (if applicable)
npm run typeorm migration:run

# Start the server
npm run dev
```

The API will run at:
👉 `http://localhost:3000`

---

## 🧪 Testing

```bash
# Run unit tests
npm run test
```

---

## 📈 Future Improvements

* Implement detailed logging with Winston
* Add integration tests
* Create automated documentation with Swagger
* Configure CI/CD and automated deployment

---

## 👨‍💻 Developed by

**Anderson Luiz**
[GitHub @AndersonL95](https://github.com/AndersonL95)

---

## 📄 License

This project is for **internal use only** and is not publicly licensed.
