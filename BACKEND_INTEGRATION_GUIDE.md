# Backend Integration Guide

This guide explains how to connect your frontend to the backend API.

## ✅ Integration Complete!

Your frontend is now ready to connect to the backend. Here's what's been set up:

### **Files Created/Updated:**
1. ✅ `src/shared/services/api.js` - API service layer
2. ✅ `src/features/auth/pages/Login.jsx` - Real authentication
3. ✅ `src/features/auth/pages/ForgotPassword.jsx` - Password reset API
4. ✅ `src/features/dashboard/pages/Dashboard.jsx` - Fetches real studies
5. ✅ `.env` - Environment configuration (you need to create this)

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Get Backend URL**
Ask your backend developer: *"What is the API base URL?"*

They'll say something like:
```
Development: http://localhost:5000/api
```

### **Step 2: Create .env File**
Create `.env` in your project root:

```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

**Location:**
```
eCOA-kaizen-lab-UI/
├── .env                    ← Create HERE
├── src/
├── package.json
```

### **Step 3: Start Both Servers**

**Terminal 1 - Backend (your colleague):**
```bash
cd backend-folder
npm start
# Output: Server running on http://localhost:5000
```

**Terminal 2 - Frontend (you):**
```bash
cd eCOA-kaizen-lab-UI
npm run dev
# Output: Local: http://localhost:5175
```

---

## 🧪 Testing

### **Test 1: Login**
1. Open http://localhost:5175/login
2. Enter credentials (provided by backend developer)
3. Click "Sign in"
4. **Success**: Redirects to dashboard
5. **Check console**: Should show "Login successful: { token: ..., user: ... }"

### **Test 2: Dashboard**
1. After login, should see dashboard
2. **Loading state**: Spinning loader appears
3. **Success**: Study cards from backend appear
4. **Search**: Type in search box → Calls backend with search query
5. **Check console**: Should show API responses

### **Test 3: Forgot Password**
1. Go to http://localhost:5175/forgot-password
2. Enter email address
3. Click "Send reset link"
4. **Success**: Shows green checkmark and confirmation
5. **Check console**: Should show API response

---

## 🔍 How to Debug

### **1. Check Browser Console (F12)**

**Good Response:**
```javascript
Login successful: {
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: { id: 1, username: "admin", name: "Admin User" }
}
```

**Error Response:**
```javascript
Login error: Invalid username or password
```

### **2. Check Network Tab (F12 → Network)**

Look for requests to your API:
- `http://localhost:5000/api/auth/login`
- `http://localhost:5000/api/studies`

**Green (200-299)** = Success
**Red (400-499)** = Client error (check credentials)
**Red (500-599)** = Server error (backend problem)

### **3. Common Issues**

**Problem: "Failed to fetch"**
```
Solution:
- Backend server not running
- Wrong API URL in .env
- CORS not enabled on backend
```

**Problem: "Invalid credentials"**
```
Solution:
- Check username/password with backend developer
- Verify login endpoint is working
```

**Problem: "Network Error"**
```
Solution:
- Check backend server is running
- Verify port number matches
- Check firewall settings
```

---

## 📋 What Backend Must Provide

Share this checklist with your backend developer:

### **Required Endpoints:**

```
POST /api/auth/login
Request:  { username: "string", password: "string" }
Response: { token: "string", user: { id, name, role } }

POST /api/auth/forgot-password
Request:  { email: "string" }
Response: { message: "Reset link sent" }

GET /api/studies?search=query
Headers:  Authorization: Bearer <token>
Response: [{ id, name, status, lastModified, patients, sites }, ...]
```

### **Requirements:**
- [ ] CORS enabled for `http://localhost:5175`
- [ ] JWT authentication implemented
- [ ] Returns proper HTTP status codes
- [ ] Error messages in format: `{ message: "error text" }`
- [ ] Test credentials provided

---

## 🔐 Authentication Flow

### **How It Works:**

```
1. User enters username/password
   ↓
2. Frontend calls: POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend returns JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. All future requests include:
   Authorization: Bearer <token>
   ↓
7. Backend verifies token before responding
```

### **Token Storage:**
```javascript
// After successful login
localStorage.setItem('authToken', response.token)
localStorage.setItem('user', JSON.stringify(response.user))

// For API requests
const token = localStorage.getItem('authToken')
headers: { Authorization: `Bearer ${token}` }
```

---

## 🌍 Environment Configuration

### **Development:**
```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

### **Staging:**
```bash
# .env.staging
VITE_API_URL=https://staging-api.ecoa.com/api
```

### **Production:**
```bash
# .env.production
VITE_API_URL=https://api.ecoa.com/api
```

---

## 📊 API Response Formats

### **Success Response:**
```json
{
  "data": [...],
  "message": "Success"
}
```

### **Error Response:**
```json
{
  "error": "Error message here",
  "message": "Detailed description"
}
```

### **Validation Error:**
```json
{
  "errors": {
    "username": "Username is required",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## 🎯 Fallback Behavior

Your frontend is smart! If the backend fails:

1. **Login**: Shows error message
2. **Dashboard**: Falls back to mock data
3. **Forgot Password**: Shows error message

**This means:**
- ✅ App won't crash
- ✅ Users see helpful errors
- ✅ Development can continue

---

## 🔧 Advanced: CORS Configuration

If you see CORS errors, backend needs to add:

**Node.js/Express:**
```javascript
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true
}))
```

**Django:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5175",
]
```

---

## ✨ You're All Set!

**Frontend is ready for backend integration!**

When backend is ready:
1. Get API URL
2. Create `.env` file
3. Test login
4. Test dashboard
5. Done! 🎉

**Integration time: 2-3 hours** (once backend is ready)

---

## 📞 Contact

**Questions for Backend Developer:**
1. What is the API base URL?
2. What are the test credentials?
3. Is CORS enabled?
4. What's the token expiry time?
5. Are endpoints documented?

**Questions?** Check the code comments in `src/shared/services/api.js`
