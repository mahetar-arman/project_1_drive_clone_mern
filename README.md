
# 📁 Drive Clone - MERN Stack Application

A full-stack **Google Drive clone** application built with **MongoDB, Express, React, and Node.js**. This application allows users to register, login, upload files to Cloudinary cloud storage, and manage their documents with JWT-based authentication.

---

## 🚀 Features

- ✅ **User Authentication** - Register and Login with bcrypt password hashing
- ✅ **JWT Token Management** - Access tokens (15m expiry) and Refresh tokens (7d expiry)
- ✅ **File Upload** - Upload files to Cloudinary cloud storage
- ✅ **File Management** - Store file metadata in MongoDB
- ✅ **Protected Routes** - Authentication middleware to protect sensitive routes
- ✅ **Cookie-based Sessions** - Secure refresh token storage using HTTP-only cookies
- ✅ **Responsive Views** - EJS templating engine for front-end rendering

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) & Bcrypt
- **File Upload**: Multer & Cloudinary
- **Template Engine**: EJS
- **Cookie Management**: Cookie-parser
- **Environment**: Dotenv

### Dependencies
```json
{
  "bcrypt": "^6.0.0",
  "cloudinary": "^2.10.0",
  "cookie-parser": "^1.4.7",
  "dotenv": "^17.4.2",
  "ejs": "^5.0.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.6.1",
  "multer": "^2.1.1"
}
```

---

## 📁 Project Structure

```
project_1_drive_clone_mern/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   ├── dbconnection.js        # MongoDB connection setup
│   │   └── multer.config.js       # File upload configuration
│   │
│   ├── controllers/
│   │   ├── auth.controllers.js    # Authentication controllers
│   │   └── uplode.controller.js   # File upload controller
│   │
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification middleware
│   │
│   ├── models/
│   │   ├── user.model.js          # User schema
│   │   └── uplodeFile.model.js    # File metadata schema
│   │
│   ├── routes/
│   │   ├── auth.router.js         # Authentication routes
│   │   └── file.router.js         # File upload routes
│   │
│   ├── views/
│   │   ├── home.ejs               # Home page
│   │   ├── login.ejs              # Login page
│   │   └── register.ejs           # Registration page
│   │
│   ├── public/                    # Static assets (CSS, JS)
│   ├── uploads/                   # Temporary file storage
│   ├── server.js                  # Server entry point
│   ├── package.json               # Project dependencies
│   └── .env                       # Environment variables
```

---

## 📊 Database Models

### 1️⃣ User Model (`models/user.model.js`)

**Purpose**: Stores user account information with authentication credentials.

```javascript
{
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  refreshToken: {
    type: String,
    default: null
  }
}
```

**Collection Name**: `users`

---

### 2️⃣ File Model (`models/uplodeFile.model.js`)

**Purpose**: Stores metadata of uploaded files with references to user who uploaded.

```javascript
{
  filename: {
    type: String,
    required: true
  },
  filrurl: {
    type: String,
    required: true
  },
  filetype: {
    type: String
  },
  filesize: {
    type: Number
  },
  uplodeby: {
    type: ObjectId,
    ref: "users"
  }
}
```

**Collection Name**: `files`

**Relationship**: Linked to User model via `uplodeby` field

---

## 🎮 Controllers

### 1️⃣ Auth Controllers (`controllers/auth.controllers.js`)

#### `registerController()`
- **Purpose**: Register a new user
- **HTTP Method**: `POST`
- **Route**: `/api/auth/register`
- **Used By**: Auth Router
- **Related Model**: User Model
- **Functionality**:
  - Validates username and email uniqueness
  - Hashes password using bcrypt with salt rounds of 10
  - Creates new user document in MongoDB
  - Returns success message with user data

---

#### `loginController()`
- **Purpose**: Authenticate user and issue tokens
- **HTTP Method**: `POST`
- **Route**: `/api/auth/login`
- **Used By**: Auth Router
- **Related Model**: User Model
- **Functionality**:
  - Verifies username exists in database
  - Compares provided password with hashed password
  - Generates JWT Access Token (15 minutes expiry)
  - Generates JWT Refresh Token (7 days expiry)
  - Stores refresh token in database
  - Sets HTTP-only cookie with refresh token
  - Redirects to home page on success

---

#### `refreshTokenController()`
- **Purpose**: Generate new access token using refresh token
- **HTTP Method**: `GET`
- **Route**: `/api/auth/refresh-token`
- **Used By**: Auth Router
- **Related Model**: User Model
- **Functionality**:
  - Retrieves refresh token from cookies
  - Verifies refresh token validity
  - Matches token with database stored token
  - Issues new access token (15 minutes expiry)
  - Returns new access token to client

---

### 2️⃣ Upload Controller (`controllers/uplode.controller.js`)

#### `uplodefileController()`
- **Purpose**: Upload file to Cloudinary and save metadata
- **HTTP Method**: `POST`
- **Route**: `/api/file/upload`
- **Used By**: File Router
- **Related Model**: File Model
- **Related Middleware**: Multer (File Upload Middleware)
- **Functionality**:
  - Validates file existence in request
  - Uploads file to Cloudinary cloud storage
  - Organizes files in `drive_documents` folder
  - Extracts file metadata (name, URL, type, size)
  - Stores file record in MongoDB
  - Returns uploaded file information

---

## 🛣️ API Routes

### Authentication Routes (`routes/auth.router.js`)

| Method | Endpoint | Controller | Description |
|--------|----------|-----------|-------------|
| `POST` | `/api/auth/register` | `registerController` | Register new user account |
| `POST` | `/api/auth/login` | `loginController` | Login user and get tokens |
| `GET` | `/api/auth/refresh-token` | `refreshTokenController` | Get new access token |
| `POST` | `/api/auth/log-out` | `logoutController` | Logout user |
| `POST` | `/api/auth/delete-user` | `deleteController` | Delete user account |

---

### File Upload Routes (`routes/file.router.js`)

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|-----------|-----------|-------------|
| `POST` | `/api/file/upload` | `uplodefileController` | `multer.single("file")` | Upload single file to Cloudinary |

---

### View Routes (Rendered via EJS)

| Method | Endpoint | View | Authentication |
|--------|----------|------|-----------------|
| `GET` | `/register` | `register.ejs` | Public |
| `GET` | `/login` | `login.ejs` | Public |
| `GET` | `/home` | `home.ejs` | Protected (Auth Middleware) |
| `GET` | `/health` | Plain text | Public |

---

## 🔐 Middleware

### Auth Middleware (`middleware/auth.middleware.js`)

**Function Name**: `isUserLogedin`

**Purpose**: Verify JWT access token and protect routes

**Functionality**:
- Extracts access token from HTTP-only cookies
- Verifies token using `JWT_ACCESS_SECRET`
- Decodes token to get user ID
- Allows request to proceed if token is valid
- Redirects to login page if token is missing or invalid
- Used on: `/home` route

**Error Handling**: Catches all errors and redirects to login page

---

## ⚙️ Configuration Files

### 1️⃣ Database Connection (`config/dbconnection.js`)
- Connects to MongoDB using Mongoose
- Uses `MONGO_URI` from environment variables
- Logs connection status (success/error)
- Throws error if `MONGO_URI` is not defined

### 2️⃣ Multer Configuration (`config/multer.config.js`)
- Configures disk storage for temporary file uploads
- Saves files to `uploads/` directory
- Renames files with timestamp to avoid conflicts
- Used in file upload routes

### 3️⃣ Cloudinary Configuration (`config/cloudinary.js`)
- Initializes Cloudinary with API credentials
- Uses environment variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Uploads files to `drive_documents` folder

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd project_1_drive_clone_mern/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
Create a `.env` file in the `backend` directory:

```env
PORT=5541
MONGO_URI=mongodb://localhost:27017/drive_clone
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4: Start the Server
```bash
npm start
```

Server runs on `http://localhost:5541`

---

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5541` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/drive_clone` |
| `JWT_ACCESS_SECRET` | Secret key for access token signing | `your_secret_key_here` |
| `JWT_REFRESH_SECRET` | Secret key for refresh token signing | `your_refresh_secret_here` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

---

## 🧪 API Testing with Sample Data

### 1️⃣ Register New User

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "username": "armmhetar",
  "email": "mahetman6@gmail.com",
  "password": "Aran2006@#"
}
```

**Expected Response** (200 OK):
```json
{
  "message": "user register succesfully ....",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "armmhetar",
    "email": "mahetman6@gmail.com",
    "password": "$2b$10$...",
    "refreshToken": null,
    "__v": 0
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "user is alredy exist please login !"
}
```

---

### 2️⃣ Login User

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "armmhetar",
  "password": "Aran2006@#"
}
```

**Expected Response** (200 OK):
- Renders `home.ejs` page
- Sets HTTP-only cookie: `refreshToken` (7 days validity)

**Cookie Header**:
```
Set-Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=604800000; Path=/
```

**Error Response** (400 Bad Request):
```json
{
  "message": "username and password are invalid !"
}
```

---

### 3️⃣ Refresh Access Token

**Endpoint**: `GET /api/auth/refresh-token`

**Request Headers**:
```
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTYyMzAwMDAwMCwiZXhwIjoxNjIzMDAwOTAwfQ..."
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Refresh token missing"
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "Invalid refresh token"
}
```

---

### 4️⃣ Upload File

**Endpoint**: `POST /api/file/upload`

**Request Type**: `multipart/form-data`

**Form Fields**:
- `file`: (binary file data)

**Request Headers**:
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
```

**Sample cURL Command**:
```bash
curl -X POST http://localhost:5541/api/file/upload \
  -F "file=@/path/to/document.pdf"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "file uplode successfully !",
  "file": {
    "_id": "507f1f77bcf86cd799439012",
    "filename": "document",
    "filrurl": "https://res.cloudinary.com/cloud-name/image/upload/v1623000000/drive_documents/document_abc123.pdf",
    "filetype": "raw",
    "filesize": 102400,
    "__v": 0
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "file required no file uploded !"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "internal server error....",
  "errorMessage": "Error details here"
}
```

---

### 5️⃣ Access Home Page (Protected Route)

**Endpoint**: `GET /home`

**Request Headers**:
```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response** (200 OK):
- Renders `home.ejs` page with user dashboard
- User can upload and manage files

**Error Response** (302 Redirect):
```
Redirects to /login if token is missing or invalid
```

---

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Registration & Authentication Flow                      │
└─────────────────────────────────────────────────────────────┘

1. REGISTER
   └─> registerController()
       └─> Check if user exists
       └─> Hash password with bcrypt
       └─> Save user to MongoDB
       └─> Return success message

2. LOGIN
   └─> loginController()
       └─> Verify username in database
       └─> Compare password with bcrypt
       └─> Generate Access Token (15m)
       └─> Generate Refresh Token (7d)
       └─> Store Refresh Token in DB
       └─> Set HTTP-only Cookie
       └─> Render home page

3. ACCESS HOME PAGE
   └─> isUserLogedin middleware
       └─> Extract token from cookie
       └─> Verify JWT signature
       └─> Allow access or redirect to login

4. TOKEN REFRESH (After 15 minutes)
   └─> refreshTokenController()
       └─> Extract refresh token from cookie
       └─> Verify refresh token
       └─> Check against DB stored token
       └─> Generate new access token
       └─> Return new token to client

5. FILE UPLOAD
   └─> Authenticated request to /api/file/upload
       └─> Multer middleware processes file
       └─> uplodefileController()
           └─> Upload to Cloudinary
           └─> Save metadata to MongoDB
           └─> Return file information
```

---

## 🚦 Status Codes Reference

| Code | Meaning | Scenario |
|------|---------|----------|
| `200` | Success | Registration, login, token refresh, file upload successful |
| `302` | Redirect | Authentication failed, redirecting to login |
| `400` | Bad Request | User already exists, file missing, invalid credentials |
| `401` | Unauthorized | Missing authentication token |
| `403` | Forbidden | Invalid or expired refresh token |
| `500` | Server Error | Database error, Cloudinary error, internal server error |

---

## 📝 Notes for Development

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds before storing
2. **Token Expiry**: 
   - Access Token: 15 minutes (for security)
   - Refresh Token: 7 days (for user convenience)
3. **File Storage**: Files are temporarily stored in `uploads/` folder and then permanently uploaded to Cloudinary
4. **Database Indexing**: Email field has unique index to prevent duplicate accounts
5. **Security**: 
   - Passwords are never returned in API responses
   - Refresh tokens stored in HTTP-only cookies (secure against XSS)
   - Set `secure: true` in production for HTTPS

---

## 🛠️ Future Enhancements

- [ ] Implement logout and delete user endpoints
- [ ] Add file deletion functionality
- [ ] Add file sharing capabilities
- [ ] Implement user profile management
- [ ] Add pagination for file lists
- [ ] Implement file versioning
- [ ] Add activity logging
- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Create frontend UI with React

---

## 📄 License

This project is open source and available under the **ISC License**.

---

## 👤 Author

Created for portfolio demonstration - Drive Clone MERN Stack Application

---

## 📞 Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Last Updated**: May 2026  
**Status**: Active Development
