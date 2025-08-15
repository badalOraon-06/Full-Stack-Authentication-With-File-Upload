# Lecture_18_Project3: User Registration, Login, and Profile with Image Upload (Node.js, Express, MongoDB, Cloudinary)

## Project Overview

This project is a full-stack Node.js application that allows users to register with a profile image, log in, and view their profile. It demonstrates how to handle file uploads, store user data in MongoDB, and use Cloudinary for image hosting. The UI is rendered using EJS templates and styled with Bootstrap.

---

## Main Features

- **User Registration:**
  - Users can register with their name, email, password, and a profile image.
  - The image is uploaded to Cloudinary, and the returned URL is stored in MongoDB.
- **User Login:**
  - Users can log in with their email and password.
  - On successful login, the user's profile page is displayed, showing their info and profile image.
- **Profile Page:**
  - Displays the user's name, email, and profile image.
  - Includes a logout button (returns to login page).

---

## Technologies Used

- **Node.js & Express:** Server and routing.
- **MongoDB & Mongoose:** Database and object modeling.
- **Multer:** Middleware for handling file uploads.
- **Cloudinary:** Cloud image hosting and CDN.
- **EJS:** Templating engine for rendering dynamic HTML.
- **Bootstrap:** For responsive and modern UI.

---

## File/Folder Structure

- `server.js` — Main server file, handles all routes and logic.
- `views/` — Contains EJS templates:
  - `login.ejs` — Login form.
  - `register.ejs` — Registration form.
  - `profile.ejs` — User profile page.
- `node_modules/` — Project dependencies.
- `package.json` — Project metadata and dependencies.

---

## How the Project Works

### 1. Registration Flow

- User visits `/register` and fills out the form (name, email, password, profile image).
- On form submission:
  - Multer processes the file upload.
  - The image is uploaded to Cloudinary.
  - User data and image info (URL, public_id) are saved in MongoDB.
  - User is redirected to the login page.

### 2. Login Flow

- User visits `/` (login page) and submits email and password.
- The server checks MongoDB for a matching user.
- If credentials are correct, the profile page is rendered with user info and image.
- If not, the login page is shown again.

### 3. Profile Page

- Shows the user's name, email, and profile image (fetched from Cloudinary).
- Includes a logout button (returns to login page).

---

## Key Code Explanations

### Multer Storage

```js
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });
```

- Configures Multer to store uploaded files with a unique name.

### Cloudinary Upload

```js
const cloudinaryRes = await cloudinary.uploader.upload(file, {
  folder: "NodeJS_Mastery_Cource",
});
```

- Uploads the file to Cloudinary and returns the image URL and public ID.

### User Schema

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  filename: String,
  public_id: String,
  imgUrl: String,
});
```

- Defines the structure of user documents in MongoDB.

### Registration Route

```js
app.post('/register', upload.single('file'), async (req, res) => { ... })
```

- Handles registration, file upload, Cloudinary upload, and user creation.

### Login Route

```js
app.post('/login', async (req, res) => { ... })
```

- Handles user authentication and profile rendering.

---

## How Everything Connects

- **Frontend (EJS):** User interacts with forms for registration and login.
- **Backend (Express):** Handles form submissions, file uploads, and database operations.
- **Multer:** Processes file uploads from the registration form.
- **Cloudinary:** Stores and serves user profile images.
- **MongoDB:** Stores user data and image info.

---

## Security Notes

- Passwords are stored in plain text for demo purposes. In production, always hash passwords!
- Cloudinary and MongoDB credentials should be stored in environment variables, not hardcoded.

---

## Summary

This project demonstrates a complete user registration and login system with image upload, using Node.js, Express, MongoDB, Multer, and Cloudinary. It is a great starting point for learning about file uploads, cloud storage, and user authentication in a Node.js web app.
