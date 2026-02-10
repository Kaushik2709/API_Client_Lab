# API Testing Tool - 2-Week Sprint Plan (Resume Edition)

## 🎯 Project Goal
Build a **lightweight API testing tool** with core features in 14 days that demonstrates full-stack skills for your resume.

**Project Name:** QuickAPI  
**Tagline:** Simple, Fast API Testing for Developers

---

## ✨ Simplified Feature Set (MVP Only)

### What We're Building:
1. ✅ **Request Builder** - Send GET, POST, PUT, DELETE requests
2. ✅ **Response Viewer** - Display formatted JSON responses
3. ✅ **Collections** - Save and organize requests
4. ✅ **Environment Variables** - Switch between dev/prod
5. ✅ **Request History** - Auto-save last 20 requests
6. ✅ **Basic Authentication** - User login/signup

### What We're NOT Building (to save time):
- ❌ Real-time collaboration
- ❌ Mock server
- ❌ AI features
- ❌ CLI tool
- ❌ Desktop app (Electron)
- ❌ Advanced testing scripts
- ❌ Code generation

---

## 🛠️ Simplified Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (free tier on MongoDB Atlas)
- **Auth:** JWT (jsonwebtoken)
- **HTTP Client:** Axios

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **State:** React Context API (no Redux)
- **HTTP Client:** Axios
- **Code Editor:** Simple textarea (no Monaco)

### Deployment
- **Backend:** Render.com (free tier)
- **Frontend:** Vercel (free tier)
- **Database:** MongoDB Atlas (free tier)

**Total Cost: $0** 💰

---

## 📅 14-Day Implementation Plan

### **Week 1: Backend + Database**

#### **Day 1-2: Project Setup & Backend Foundation**
- [ ] Initialize Node.js project
- [ ] Set up Express server
- [ ] Connect to MongoDB Atlas
- [ ] Create User model and auth routes (signup/login)
- [ ] Implement JWT authentication
- [ ] Test with Postman/Thunder Client

**Deliverable:** Working auth API

#### **Day 3-4: Core Request Engine**
- [ ] Create Request model (save requests to DB)
- [ ] Build HTTP request execution service
- [ ] Create API endpoints:
  - `POST /api/requests/execute` - Execute HTTP request
  - `POST /api/requests/save` - Save request to collection
  - `GET /api/requests` - Get user's saved requests
  - `DELETE /api/requests/:id` - Delete request
- [ ] Test all endpoints

**Deliverable:** Request execution API working

#### **Day 5-6: Collections & Environment**
- [ ] Create Collection model
- [ ] Create Environment model
- [ ] Build collection CRUD endpoints
- [ ] Build environment CRUD endpoints
- [ ] Implement variable interpolation (replace {{baseUrl}} in requests)
- [ ] Add request history (last 20 requests)

**Deliverable:** Complete backend API

#### **Day 7: Backend Polish & Deploy**
- [ ] Add error handling middleware
- [ ] Add input validation
- [ ] Write basic tests (optional)
- [ ] Deploy to Render.com
- [ ] Test deployed API

**Deliverable:** Live backend URL

---

### **Week 2: Frontend + Integration**

#### **Day 8-9: Frontend Setup & Auth**
- [ ] Create React app with Vite
- [ ] Set up Tailwind CSS
- [ ] Create auth context
- [ ] Build Login/Signup pages
- [ ] Implement protected routes
- [ ] Connect to backend auth API

**Deliverable:** Working authentication flow

#### **Day 10-11: Request Builder UI**
- [ ] Build request builder form:
  - Method selector (GET, POST, PUT, DELETE)
  - URL input
  - Headers editor (key-value pairs)
  - Body editor (JSON textarea)
  - Auth tab (Bearer token, Basic auth)
- [ ] Build response viewer:
  - Status code badge
  - Response time
  - Formatted JSON display
  - Headers display
- [ ] Connect to backend execute API
- [ ] Add loading states

**Deliverable:** Can send requests and see responses

#### **Day 12-13: Collections & History**
- [ ] Build sidebar with tabs (Collections, History)
- [ ] Create collection management UI
- [ ] Build request list component
- [ ] Implement save request functionality
- [ ] Add environment selector dropdown
- [ ] Connect all to backend APIs

**Deliverable:** Full working app

#### **Day 14: Polish & Deploy**
- [ ] Add dark mode toggle
- [ ] Improve UI/UX (spacing, colors, icons)
- [ ] Add keyboard shortcuts (Ctrl+Enter to send)
- [ ] Fix bugs
- [ ] Deploy to Vercel
- [ ] Test production app
- [ ] Create README.md with screenshots

**Deliverable:** Live production app

---

## 📁 Project Structure

### Backend Structure
```
quickapi-backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Request.js
│   │   ├── Collection.js
│   │   └── Environment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── requests.js
│   │   ├── collections.js
│   │   └── environments.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/
│   │   └── requestExecutor.js
│   └── server.js
├── .env
└── package.json
```

### Frontend Structure
```
quickapi-frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── RequestBuilder/
│   │   │   ├── MethodSelector.jsx
│   │   │   ├── URLInput.jsx
│   │   │   ├── HeadersEditor.jsx
│   │   │   ├── BodyEditor.jsx
│   │   │   └── AuthTab.jsx
│   │   ├── ResponseViewer/
│   │   │   ├── ResponseBody.jsx
│   │   │   └── ResponseMeta.jsx
│   │   └── Sidebar/
│   │       ├── Collections.jsx
│   │       └── History.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   └── App.jsx
├── tailwind.config.js
└── package.json
```

---

## 💻 Quick Start Commands

### Backend Setup
```bash
# Create project
mkdir quickapi-backend && cd quickapi-backend
npm init -y

# Install dependencies
npm install express mongoose dotenv jsonwebtoken bcryptjs cors axios

# Install dev dependencies
npm install -D nodemon

# Create .env file
echo "MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key_here
PORT=5000" > .env

# Start server
npm run dev
```

### Frontend Setup
```bash
# Create React app
npm create vite@latest quickapi-frontend -- --template react
cd quickapi-frontend

# Install dependencies
npm install axios react-router-dom

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start dev server
npm run dev
```

---

## 🎨 Simple UI Design

### Color Scheme
- **Primary:** #3B82F6 (Blue)
- **Success:** #10B981 (Green)
- **Error:** #EF4444 (Red)
- **Background:** #1F2937 (Dark Gray)
- **Text:** #F9FAFB (Light Gray)

### Layout
```
┌─────────────────────────────────────────────────────┐
│  QuickAPI                    [Dark Mode] [Logout]   │
├──────────┬──────────────────────────────────────────┤
│          │  [GET ▼] [https://api.example.com/users] │
│ Sidebar  │  ┌─ Headers ─ Body ─ Auth ─┐             │
│          │  │ Content-Type: application/json        │
│ • Colls  │  └──────────────────────────┘             │
│ • History│  [Send Request] ⚡                        │
│          │  ─────────────────────────────────────── │
│          │  Response (200 OK) - 145ms                │
│          │  {                                        │
│          │    "users": [...]                         │
│          │  }                                        │
└──────────┴──────────────────────────────────────────┘
```

---

## 🗄️ Minimal Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Requests Collection
```javascript
{
  userId: ObjectId,
  name: String,
  method: String,
  url: String,
  headers: [{ key: String, value: String }],
  body: String,
  auth: { type: String, token: String },
  collectionId: ObjectId (optional),
  createdAt: Date
}
```

### Collections Collection
```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  createdAt: Date
}
```

### Environments Collection
```javascript
{
  userId: ObjectId,
  name: String,
  variables: [{ key: String, value: String }],
  isActive: Boolean
}
```

---

## 🔑 Core Code Snippets

### Backend: Request Executor Service
```javascript
// services/requestExecutor.js
const axios = require('axios');

const executeRequest = async (requestConfig) => {
  const startTime = Date.now();
  
  try {
    const response = await axios({
      method: requestConfig.method,
      url: requestConfig.url,
      headers: requestConfig.headers || {},
      data: requestConfig.body || undefined,
      timeout: 30000,
      validateStatus: () => true // Don't throw on any status
    });
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
};

module.exports = { executeRequest };
```

### Frontend: Request Builder Component
```jsx
// components/RequestBuilder/RequestBuilder.jsx
import { useState } from 'react';
import axios from 'axios';

export default function RequestBuilder() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/requests/execute', {
        method,
        url,
        headers: headers.filter(h => h.key),
        body: body ? JSON.parse(body) : undefined
      });
      setResponse(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      {/* Method selector and URL input */}
      <div className="flex gap-2 mb-4">
        <select value={method} onChange={(e) => setMethod(e.target.value)}
                className="px-4 py-2 bg-gray-800 rounded">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
               placeholder="https://api.example.com/endpoint"
               className="flex-1 px-4 py-2 bg-gray-800 rounded" />
        <button onClick={sendRequest} disabled={loading}
                className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      {/* Response viewer */}
      {response && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <div className="mb-2">
            <span className={`px-2 py-1 rounded ${
              response.status < 300 ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {response.status} {response.statusText}
            </span>
            <span className="ml-4 text-gray-400">
              {response.responseTime}ms
            </span>
          </div>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Resume Presentation

### Project Title
**QuickAPI - Lightweight API Testing Platform**  
*Node.js, Express, React, MongoDB, JWT, Tailwind CSS*

### Bullet Points (Choose 3-4)
- Built a **full-stack web application** for API testing with **request builder, collections, and environment management**
- Developed **RESTful API** with Express.js handling **HTTP request execution** and **user authentication** using JWT
- Designed **MongoDB database schema** for storing user requests, collections, and environments with proper indexing
- Created **responsive React UI** with Tailwind CSS featuring real-time request/response display and dark mode
- Implemented **variable interpolation system** allowing dynamic environment-based URL and header substitution
- Deployed production-ready application on **Render and Vercel** with **MongoDB Atlas** cloud database

### GitHub README Highlights
- Live demo link
- Screenshots of the UI
- Features list
- Tech stack
- Installation instructions
- API documentation

---

## 🎯 Daily Time Commitment

**2-3 hours per day = 28-42 hours total**

- **Days 1-7 (Backend):** 3 hours/day = 21 hours
- **Days 8-14 (Frontend):** 3 hours/day = 21 hours

**Total: ~40 hours** (very achievable in 2 weeks!)

---

## ✅ Success Criteria

By Day 14, you should have:
- ✅ Live backend API on Render
- ✅ Live frontend on Vercel
- ✅ Working login/signup
- ✅ Can send HTTP requests and see responses
- ✅ Can save requests to collections
- ✅ Can switch between environments
- ✅ Clean, professional UI
- ✅ GitHub repo with good README
- ✅ Screenshots for resume/portfolio

---

## 🚀 Bonus Features (If Time Permits)

If you finish early, add these quick wins:
- [ ] Export collection as JSON
- [ ] Import collection from JSON
- [ ] Request search/filter
- [ ] Copy response to clipboard
- [ ] Keyboard shortcuts (Ctrl+Enter to send)
- [ ] Request duplication

---

## 📚 Learning Resources

### Quick Tutorials (Watch These First)
- "Build a REST API with Node.js" (1 hour)
- "React Crash Course" (1 hour)
- "Tailwind CSS Tutorial" (30 mins)
- "JWT Authentication Explained" (20 mins)

### Documentation
- Express.js docs
- React docs
- MongoDB docs
- Tailwind CSS docs

---

## 💡 Pro Tips

1. **Don't Overthink**: Keep it simple, make it work first
2. **Use ChatGPT**: For boilerplate code and debugging
3. **Copy UI Patterns**: Look at Postman/Insomnia for inspiration
4. **Test as You Build**: Don't wait until the end
5. **Commit Often**: Push to GitHub daily
6. **Focus on Core**: Skip nice-to-haves if running out of time
7. **Make it Pretty**: Good UI makes a huge difference on resume

---

## 🎬 Getting Started Right Now

### Step 1: Set Up MongoDB Atlas (10 mins)
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier)
4. Get connection string

### Step 2: Initialize Backend (15 mins)
```bash
mkdir quickapi && cd quickapi
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv jsonwebtoken bcryptjs cors axios
npm install -D nodemon
```

### Step 3: Create First Route (20 mins)
Create `server.js` and test with `npm run dev`

### Step 4: Keep Building! 🚀

---

## 🎉 Final Thoughts

This simplified plan is **100% achievable in 2 weeks** while still being **impressive for your resume**. It demonstrates:

- ✅ Full-stack development
- ✅ RESTful API design
- ✅ Database modeling
- ✅ Authentication & security
- ✅ Modern frontend development
- ✅ Deployment & DevOps

**Focus on finishing rather than perfecting. A working project beats a perfect plan!**

Good luck! 💪 You've got this!
