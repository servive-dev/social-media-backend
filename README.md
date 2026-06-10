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

 ## 🔐 Authentication ✅
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

# API'S
```
## AUTH ✅
POST    /api/v1/auth/register
POST    /api/v1/auth/verify-otp
POST    /api/v1/auth/resend-otp
POST    /api/v1/auth/login
POST    /api/v1/auth/refresh
POST    /api/v1/auth/logout
POST    /api/v1/auth/logout-all
POST    /api/v1/auth/forgot-password
POST    /api/v1/auth/reset-password
PATCH   /api/v1/auth/change-password
GET     /api/v1/auth/me

## USER ✅
GET     /api/v1/users/:username
PATCH   /api/v1/users/profile
PATCH   /api/v1/users/avatar
PATCH   /api/v1/users/cover-photo
DELETE  /api/v1/users/avatar
GET     /api/v1/users/suggestions
GET     /api/v1/users/search?q=
GET     /api/v1/users/:id/followers
GET     /api/v1/users/:id/following
POST    /api/v1/users/:id/follow
DELETE  /api/v1/users/:id/follow
POST    /api/v1/users/block/:id
DELETE  /api/v1/users/block/:id
POST    /api/v1/users/mute/:id
DELETE  /api/v1/users/mute/:id

## POST 
POST    /api/v1/posts
GET     /api/v1/posts/feed
GET     /api/v1/posts/explore
GET     /api/v1/posts/:id
PATCH   /api/v1/posts/:id
DELETE  /api/v1/posts/:id
POST    /api/v1/posts/:id/like
DELETE  /api/v1/posts/:id/like
POST    /api/v1/posts/:id/save
DELETE  /api/v1/posts/:id/save
GET     /api/v1/posts/user/:userId

## COMMENT 
POST    /api/v1/comments/:postId
GET     /api/v1/comments/:postId
PATCH   /api/v1/comments/:commentId
DELETE  /api/v1/comments/:commentId
POST    /api/v1/comments/:commentId/like
DELETE  /api/v1/comments/:commentId/like
POST    /api/v1/comments/:commentId/reply

## REELS
POST    /api/v1/reels
GET     /api/v1/reels/feed
GET     /api/v1/reels/:id
DELETE  /api/v1/reels/:id
POST    /api/v1/reels/:id/like
POST    /api/v1/reels/:id/comment
POST    /api/v1/reels/:id/share

## STORIES
POST    /api/v1/stories
GET     /api/v1/stories/feed
GET     /api/v1/stories/:userId
DELETE  /api/v1/stories/:storyId
POST    /api/v1/stories/:storyId/view
POST    /api/v1/stories/:storyId/like

## CHATS
GET     /api/v1/chats
POST    /api/v1/chats
GET     /api/v1/chats/:chatId
DELETE  /api/v1/chats/:chatId
POST    /api/v1/messages
GET     /api/v1/messages/:chatId
DELETE  /api/v1/messages/:messageId
POST    /api/v1/messages/:messageId/react
POST    /api/v1/messages/:messageId/seen

## NOTIFICATION 
GET     /api/v1/notifications
PATCH   /api/v1/notifications/read/:id
PATCH   /api/v1/notifications/read-all
DELETE  /api/v1/notifications/:id

## SEARCH 
GET     /api/v1/search/users?q=
GET     /api/v1/search/posts?q=
GET     /api/v1/search/reels?q=
GET     /api/v1/search/hashtags?q=

## SESSION
GET     /api/v1/sessions
DELETE  /api/v1/sessions/:sessionId
DELETE  /api/v1/sessions

## SECURTIY 2FA
GET     /api/v1/security/login-activity
POST    /api/v1/security/2fa/enable
POST    /api/v1/security/2fa/verify
POST    /api/v1/security/2fa/disable

## SETTING 
GET     /api/v1/settings/privacy
PATCH   /api/v1/settings/privacy
PATCH   /api/v1/settings/account
PATCH   /api/v1/settings/notifications

## REPORT 
POST    /api/v1/reports/user/:id
POST    /api/v1/reports/post/:id
POST    /api/v1/reports/comment/:id

## FILES
POST    /api/v1/uploads/image
POST    /api/v1/uploads/video
DELETE  /api/v1/uploads/:id

## ADMIN
GET     /api/v1/admin/users
DELETE  /api/v1/admin/users/:id
GET     /api/v1/admin/reports
DELETE  /api/v1/admin/posts/:id
GET     /api/v1/admin/statistics

## HASHTAG 
GET     /api/v1/hashtags/:tag
GET     /api/v1/hashtags/trending

```