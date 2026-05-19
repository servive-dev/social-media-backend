# 📸 Social-Media-Backend
A scalable Instagram-like social media backend built using Node.js, Express.js, and MongoDB.

This project supports:
- User Authentication
- Profile Management
- Image/Video Uploads
- Posts/Reels
- Likes & Comments
- Follow System
- Stories
- Messaging System

---

# 🚀 Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- JWT (JSON Web Token)
- bcryptjs

## File Upload
- Multer
- Cloudinary

## Other Tools
- dotenv
- cors
- cookie-parser

## 📁  Folder Structure  

```
/backend
│
├── /src
│   │
│   ├── /config
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── socket.js
│   │
│   ├── /controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── follow.controller.js
│   │   ├── story.controller.js
│   │   └── message.controller.js
│   │
│   ├── /models
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   ├── comment.model.js
│   │   ├── story.model.js
│   │   ├── conversation.model.js
│   │   └── message.model.js
│   │
│   ├── /routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── follow.routes.js
│   │   ├── story.routes.js
│   │   └── message.routes.js
│   │
│   ├── /middleware
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── /services
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── post.service.js
│   │   ├── story.service.js
│   │   └── message.service.js
│   │
│   ├── /utils
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   ├── deleteFile.js
│   │   └── formatDate.js
│   │
│   ├── /validators
│   │   ├── auth.validator.js
│   │   ├── post.validator.js
│   │   └── user.validator.js
│   │
│   ├── /uploads
│   │   ├── profiles
│   │   ├── posts
│   │   └── stories
│   │
│   ├── app.js
│   └── index.js
│
├── .env
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json
└── README.md


```

# ✨ Features 

 ## 🔐 Authentication ❌
   - User Registration 
   - User Login
   - JWT Authentication
   - Protected Routes

 ## 👤 User Profile ❌
   - Update Profile
   - Update Profile Image
   - Bio & Username
   - Follows / Unfollow Users

 ## 📸 Posts & Reels ❌
   - Upload Images/Videos
   - Create Post
   - Delete Post
   - Feed System

 ## ❤️ Likes & Comments ❌
   - Like / Unlike Posts
   - Add Comments
   - Delete Comments

 ## 📖 Stories ❌
   - Upload stories
   - 24-Hours Expires

 ## 💬 Messaging ❌
   - One-to-One Chat
   - Chat History

 ## 📖 Stories ❌
   - Upload stories
   - 24-Hours Expires
   - Delete Post
   - Feed System

---

# Flow of data to get notification
---
```
FRONTEND
  ↓
routes/post.routes.js
  ↓
controllers/post.controller.js
  ↓
models/post.model.js
  ↓
services/notification.service.js
  ↓
queues/notification.queue.js
  ↓
REDIS (BullMQ storage)
  ↓
workers/notification.worker.js
  ↓
models/notification.model.js
  ↓
(optional) services/email.service.js
  ↓
(optional) socket/socket.js
  ↓
USER gets notification

```
```
1. User clicks "LIKE"
        ↓
2. Frontend calls API
   POST /like-post
        ↓
3. Backend updates MongoDB
   (post likes increment)
        ↓
4. Backend pushes job to BullMQ queue
   notificationQueue.add()
        ↓
5. Redis stores job
        ↓
6. Worker picks job
        ↓
7. Worker processes:
   → create notification
   → send email (optional)
        ↓
8. Save notification in DB
        ↓
9. (Optional) send real-time socket event
        ↓
10. User sees notification
```

# OverAll Architecture
```
                    ┌──────────────────────┐
                    │      CLIENT          │
                    │ (Mobile / Web App)   │
                    └─────────┬────────────┘
                              │ HTTP Request
                              ▼
                    ┌──────────────────────┐
                    │   EXPRESS API        │
                    │ (Backend Server)     │
                    └─────────┬────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼

   MongoDB DB          Redis Cache            BullMQ Queue
 (Users, Posts)     (Fast data layer)     (Background jobs)
        │                     │                      │
        │                     │                      │
        ▼                     ▼                      ▼

                    ┌──────────────────────┐
                    │     WORKERS          │
                    │ (Background jobs)    │
                    └─────────┬────────────┘
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼

        Email Worker   Notification Worker   Other Workers
        (Nodemailer)   (Likes, Follows)     (Media, etc)

                              │
                              ▼
                    ┌──────────────────────┐
                    │   USER GETS RESULT   │
                    │ Email / Notification │
                    └──────────────────────┘
```
---

# Final Flow
```
Frontend
   ↓
Backend API
   ↓
Redis + Queue
   ↓
Workers
   ↓
MongoDB + Email + Notifications
   ↓
User sees updates

```