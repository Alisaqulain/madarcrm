# Madrasa CRM - Backend Documentation

Complete backend implementation for Madrasa CRM using Next.js App Router, MongoDB Atlas, and Mongoose.

## 🚀 Features

- ✅ **Multi-language Support** (English, Hindi, Urdu with RTL)
- ✅ **JWT Authentication** (Admin & Parent roles)
- ✅ **Student Management** (CRUD with multi-language search)
- ✅ **Attendance Management** (Mark, update, filter)
- ✅ **Fees Management** (Add, update, reports)
- ✅ **Kitchen Expense Management** (CRUD with reports)
- ✅ **Dashboard Statistics** (Real-time analytics)
- ✅ **Parent Portal** (Read-only student reports)
- ✅ **Input Validation** (Zod schemas)
- ✅ **Error Handling** (Centralized error management)

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm/yarn/pnpm

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/madrasa_crm?retryWrites=true&w=majority

# JWT Secret Key (Generate a secure random string)
JWT_SECRET=your-secret-key-change-in-production

# Node Environment
NODE_ENV=development
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🗄️ Database Models

### Student
- Multi-language fields: `name`, `fatherName`, `motherName`, `address`
- Auto-generated `studentId` (YYYY#### format)
- Indexed for fast search across all languages

### Attendance
- Links to Student
- Unique per student per date
- Optional multi-language remarks

### Fee
- Links to Student
- Unique per student per month/year
- Auto-calculates `dueAmount`

### Kitchen
- Multi-language `itemName`
- Auto-calculates `totalAmount`
- Tracks `addedBy` admin

### Admin
- Password hashed with bcrypt
- Roles: `admin` or `parent`

## 🔐 Authentication

### Login Endpoint
```
POST /api/auth/login
Body: { username: string, password: string }
Response: { token, user }
```

### Using JWT Token
Add to request headers:
```
Authorization: Bearer <token>
```

Or use cookie (automatically set on login).

## 📡 API Endpoints

### Students
- `GET /api/students` - List all (with search, class, status filters)
- `POST /api/students` - Add new student
- `GET /api/students/[id]` - Get single student
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

**Query Parameters:**
- `?search=name` - Search by name/father name (any language)
- `?class=1` - Filter by class
- `?status=Active` - Filter by status
- `?lang=en|hi|ur` - Response language

### Attendance
- `GET /api/attendance` - List attendance (with filters)
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/[id]` - Update attendance
- `DELETE /api/attendance/[id]` - Delete attendance

**Query Parameters:**
- `?studentId=xxx` - Filter by student
- `?date=2024-01-01` - Filter by date
- `?class=1` - Filter by class

### Fees
- `GET /api/fees` - List fees (with filters)
- `POST /api/fees` - Add/Update fee
- `GET /api/fees/reports?type=monthly|pending|student` - Fee reports

**Query Parameters:**
- `?studentId=xxx` - Filter by student
- `?month=1` - Filter by month (1-12)
- `?year=2024` - Filter by year
- `?status=Paid|Pending` - Filter by status

### Kitchen
- `GET /api/kitchen` - List expenses (with date/month/year filters)
- `POST /api/kitchen` - Add expense
- `PUT /api/kitchen/[id]` - Update expense
- `DELETE /api/kitchen/[id]` - Delete expense

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

**Query Parameters:**
- `?month=1` - Month for statistics
- `?year=2024` - Year for statistics

### Parents (Read-only)
- `GET /api/parents/search?search=name` - Search students
- `GET /api/parents/student/[id]` - Get student profile with reports

**No authentication required** (but optional for better access)

## 🌐 Multi-language Support

### Language Detection
1. Query parameter: `?lang=en|hi|ur`
2. Accept-Language header: `Accept-Language: hi,en;q=0.9`
3. Default: English (`en`)

### Response Format
All API responses include:
```json
{
  "success": true,
  "data": {...},
  "lang": "en",
  "rtl": false,
  "message": "Success message"
}
```

### Multi-language Fields
Student fields support all three languages:
```json
{
  "name": {
    "en": "Ahmed Ali",
    "hi": "अहमद अली",
    "ur": "احمد علی"
  }
}
```

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT token authentication
- Role-based access control
- Input validation (Zod)
- SQL injection protection (Mongoose)
- XSS protection (Next.js built-in)

## 📊 Database Indexes

Optimized indexes for:
- Student name search (all languages)
- Father name search (all languages)
- Attendance (studentId + date)
- Fees (studentId + month + year)
- Kitchen expenses (date)

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get Students (with token)
curl http://localhost:3000/api/students?lang=hi \
  -H "Authorization: Bearer <token>"

# Search Students
curl "http://localhost:3000/api/students?search=Ahmed&lang=ur" \
  -H "Authorization: Bearer <token>"
```

### Using Postman/Thunder Client

1. Set `Authorization` header: `Bearer <token>`
2. Add `lang` query parameter for language preference
3. Use `Content-Type: application/json` for POST/PUT requests

## 🐛 Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "message": "Error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 📝 Creating Initial Admin

You can create an admin user using MongoDB Compass or MongoDB Shell:

```javascript
// Connect to your database
use madrasa_crm

// Create admin (password will be auto-hashed by model)
db.admins.insertOne({
  username: "admin",
  email: "admin@madrasa.com",
  password: "your-password", // Will be hashed automatically
  role: "admin",
  name: "Administrator"
})
```

Or use a script (create `scripts/create-admin.js`):

```javascript
const mongoose = require('mongoose');
const { Admin } = require('../models/Admin');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const admin = new Admin({
    username: 'admin',
    email: 'admin@madrasa.com',
    password: 'admin123', // Will be hashed
    role: 'admin',
    name: 'Administrator'
  });
  
  await admin.save();
  console.log('Admin created successfully');
  process.exit(0);
});
```

## 🚀 Production Deployment

1. Set environment variables in your hosting platform
2. Ensure `JWT_SECRET` is a strong random string
3. Set `NODE_ENV=production`
4. Build the application: `npm run build`
5. Start: `npm start`

## 📚 Project Structure

```
/app/api/          # API routes
/lib/              # Utilities (db, i18n, validation, errors)
/models/           # Mongoose models
/middleware/       # Authentication middleware
/locales/          # Translation files (en, hi, ur)
```

## ✅ Build Status

Run `npm run build` to verify:
- ✅ All TypeScript types are correct
- ✅ All imports are resolved
- ✅ No linting errors
- ✅ Production-ready build

## 🔄 Next Steps

1. **Set up MongoDB Atlas** connection string
2. **Create initial admin user**
3. **Test all API endpoints**
4. **Connect frontend to backend APIs**
5. **Deploy to production**

---

**Built with:** Next.js 14, MongoDB Atlas, Mongoose, JWT, Zod, TypeScript

