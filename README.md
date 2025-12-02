# 🚀 MyTasks – Personal Task Manager

A full-stack Task Management Application built using React, Node.js, Express, and MySQL.  
Users can register, login, create tasks, edit them, mark complete, detect overdue tasks, and manage their personal to-do workflow securely.

## 📸 Preview
### Initial Databse
![Initial Database](frontend/assests/initail-db.png)

### Signup Page
![Sign Up](frontend/assests/signup.png)

### New User updated in DB
![New User Created](frontend/assests/new-user-created.png)

### Frontend(Landing) Page 
![Landing Page](frontend/assests/landing-page.png)

### Acount Created
![After Account Creation](frontend/assests/after-account-create.png)

### Profile Updated
![Profile Update](frontend/assests/profile-update.png)

### After Logging out
![After Logout](frontend/assests/after-logout.png)

## Tasks
![Tasks](frontend/assests/tasks.png)

### Tasks Completed
![Task Completed](frontend/assests/task-completed.png)

### Tasks Updated
![Task Updated](frontend/assests/task-updated.png)

### Tasks Deleed
![Delete Task](frontend/assests/delete-task.png)

### Dark Mode
![Dark Mode](frontend/assests/dark-mode.png)


## 🧩 Key Features
- Authentication (JWT)
- Create/Edit/Delete Tasks
- Mark Completed
- Auto Overdue Detection
- Live Search
- Profile Update
- Theme Switch
- Responsive UI

## 🧠 Tech Stack
**Frontend:** React, TailwindCSS, Axios, Context API  
**Backend:** Node.js, Express, JWT, MySQL, Express Validator

## 🗂 Folder Structure
MyTasks/
 backend/
 frontend/

## 🔐 Environment Variables

Backend .env:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS= YOUR_MYSQL_PASSWORD
DB_NAME=mytasks
JWT_SECRET=yoursecretkey
JWT_EXPIRES_IN=30d
```

Frontend .env:
```
VITE_API_URL=http://localhost:5000/api
```

.gitignore:
```
backend/.env
frontend/.env
```

## 🛠 Setup

Clone repo:
```
git clone <repo-url>
cd MyTasks
```

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## 🧪 MySQL Schema
```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  designation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(150),
  description TEXT,
  due_date DATE,
  status ENUM('pending','completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
