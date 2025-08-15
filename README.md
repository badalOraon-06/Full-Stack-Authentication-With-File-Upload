# User Registration & Authentication System

A full-stack web application built with Node.js, Express, MongoDB, and Cloudinary for user registration, authentication, and profile management with image upload capabilities.

## 🚀 Features

- **User Registration**: Complete registration system with profile image upload
- **User Authentication**: Secure login system with email and password
- **Profile Management**: View user profile with uploaded profile picture
- **Cloud Image Storage**: Images stored and served via Cloudinary CDN
- **Responsive Design**: Modern UI with Bootstrap framework
- **Database Integration**: User data stored in MongoDB with Mongoose ODM

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cloud Storage**: Cloudinary (for profile images)
- **File Upload**: Multer middleware
- **Template Engine**: EJS
- **Frontend**: Bootstrap 5, HTML5, CSS3
- **Authentication**: Basic email/password authentication

## 📁 Project Structure

```
Lecture_18_Project3/
├── views/
│   ├── login.ejs           # Login page template
│   ├── register.ejs        # Registration page template
│   └── profile.ejs         # User profile page template
├── server.js               # Main server file
├── package.json            # Project dependencies
├── PROJECT_NOTE.md         # Detailed project documentation
└── README.md              # Project overview
```

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account (MongoDB Atlas recommended)
- Cloudinary account for image hosting

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Lecture_18_Project3
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:

   ```env
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Server Configuration
   PORT=1000
   ```

4. **Update Configuration**:
   Replace hardcoded credentials in `server.js` with environment variables:

   ```javascript
   // MongoDB Connection
   mongoose.connect(process.env.MONGODB_URI, {
     dbName: "NodeJs_Mastery_Course",
   });

   // Cloudinary Config
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });
   ```

5. **Start the server**:

   ```bash
   npm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:1000`

## 🔄 Application Flow

### Registration Process

1. User navigates to `/register`
2. Fills out registration form (name, email, password, profile image)
3. Image is uploaded to Cloudinary
4. User data and image URL are saved to MongoDB
5. User is redirected to login page

### Login Process

1. User enters email and password on `/` (login page)
2. Server validates credentials against MongoDB
3. On success: Profile page is rendered with user data and image
4. On failure: Login page is displayed again

### Profile Page

- Displays user's name, email, and profile picture
- Profile image is served from Cloudinary CDN
- Includes logout functionality

## 📊 Database Schema

### User Model

```javascript
{
  name: String,         // User's full name
  email: String,        // User's email address
  password: String,     // User's password (plain text - for demo only)
  filename: String,     // Original filename of uploaded image
  public_id: String,    // Cloudinary public ID for image management
  imgUrl: String        // Cloudinary secure URL for image display
}
```

## 🎨 UI Components

- **Login Page**: Clean form with email and password fields
- **Registration Page**: Extended form with file upload for profile picture
- **Profile Page**: User dashboard displaying personal information and profile image
- **Responsive Design**: Works on desktop and mobile devices
- **Bootstrap Integration**: Modern, professional styling

## 🔒 Security Considerations

> **⚠️ Important Security Notes**

- **Passwords**: Currently stored as plain text. For production, implement password hashing with bcrypt
- **Environment Variables**: Move all sensitive credentials to `.env` file
- **Input Validation**: Add comprehensive input validation and sanitization
- **Authentication**: Consider implementing JWT tokens for session management
- **File Upload Security**: Add file type and size validation

## 🚧 Recommended Improvements

- [ ] **Password Hashing**: Implement bcrypt for secure password storage
- [ ] **JWT Authentication**: Replace basic auth with JWT tokens
- [ ] **Input Validation**: Add comprehensive form validation
- [ ] **Error Handling**: Implement proper error handling and user feedback
- [ ] **Session Management**: Add secure session handling
- [ ] **Password Reset**: Implement forgot password functionality
- [ ] **Email Verification**: Add email verification for new accounts
- [ ] **Profile Updates**: Allow users to update their profile information
- [ ] **Image Optimization**: Compress images before upload
- [ ] **Rate Limiting**: Add request rate limiting to prevent abuse

## 📦 Dependencies

```json
{
  "cloudinary": "^2.7.0", // Cloud image storage
  "ejs": "^3.1.10", // Template engine
  "express": "^5.1.0", // Web framework
  "mongoose": "^8.16.0", // MongoDB ODM
  "multer": "^2.0.1" // File upload middleware
}
```

## 🌐 API Endpoints

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| GET    | /         | Serve login page         |
| GET    | /register | Serve registration page  |
| POST   | /register | Handle user registration |
| POST   | /login    | Handle user login        |

## 📝 Usage Examples

### Registration

1. Navigate to `/register`
2. Enter name, email, password
3. Select profile image
4. Click "Register"

### Login

1. Navigate to `/` (home/login page)
2. Enter registered email and password
3. Click "Login"
4. View profile page with uploaded image

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For questions and support:

- Create an issue in the repository
- Check the `PROJECT_NOTE.md` for detailed technical documentation

---

**Note**: This is a learning project. For production use, implement proper security measures including password hashing, input validation, and secure session management.
