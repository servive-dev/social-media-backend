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

