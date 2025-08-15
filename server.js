// Importing necessary modules
import express from 'express'; // Express framework for building web applications
import mongoose from 'mongoose'; // Mongoose for interacting with MongoDB
import multer from 'multer'; // Multer for handling file uploads (multipart/form-data)
import path from 'path'; // Path module for handling file paths

const app = express();

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }))

// Importing Cloudinary v2 for uploading files to the cloud
import { v2 as cloudinary } from 'cloudinary';

// Configuring Cloudinary with credentials
cloudinary.config({
  cloud_name: 'dkut3fpbm',
  api_key: '753421337529324',
  api_secret: 'x9pCCKeYhPccJ0JMHHPf5dIxLgk'
});

// Connecting to MongoDB using Mongoose
mongoose.connect("mongodb+srv://newbadal06:T4ccibRhil1SWS9y@cluster0.bmurwbv.mongodb.net/",
  { dbName: "NodeJs_Mastery_Course" }) // Specify the database name
  .then(() => console.log("Connected to MongoDB")) // Log success message
  .catch((err) => console.log(err)); // Log any error that occurs

// Route to serve login page
app.get('/', (req, res) => {
  res.render('login.ejs', { url: null }); // Renders login.ejs view with null image URL
});

// Route to serve registration page
app.get('/register', (req, res) => {
  res.render('register.ejs', { url: null }); // Renders register.ejs view
});

// Configure multer storage settings
const storage = multer.diskStorage({
  // destination is not used here because we are uploading to cloudinary

  // Function to customize the filename before saving
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // Add timestamp to original filename
    cb(null, file.fieldname + '-' + uniqueSuffix); // e.g., file-1723748273.jpg
  }
});

// Initialize multer middleware with the above storage config
const upload = multer({ storage: storage });

// Mongoose schema to define user data structure
const userSchema = new mongoose.Schema({
  name: String,          // User's name
  email: String,         // User's email
  password: String,      // Password (stored as plain text — not safe for production)
  filename: String,      // Original filename of uploaded file
  public_id: String,     // Cloudinary public ID of uploaded image
  imgUrl: String,        // Cloudinary secure URL of the image
});

// Creating a Mongoose model named 'User' from the schema
const User = mongoose.model("user", userSchema);

// POST route to handle user registration
app.post('/register', upload.single('file'), async (req, res) => {
  const file = req.file.path; // Get the file path of the uploaded image

  // Extract form fields using destructuring
  const { name, email, password } = req.body;

  // Upload file to Cloudinary under folder "NodeJS_Mastery_Course"
  const cloudinaryRes = await cloudinary.uploader.upload(file, {
    folder: "NodeJS_Mastery_Cource"
  });

  // Save user data in MongoDB, along with cloudinary image info
  const db = await User.create({
    name,
    email,
    password,
    filename: file.originalname,              // Optional: you can use req.file.originalname if needed
    public_id: cloudinaryRes.public_id,       // Public ID for future access/delete
    imgUrl: cloudinaryRes.secure_url,         // Direct secure URL to access the image
  });

  // Redirect to login page after successful registration
  res.redirect('/');
});

// POST route to handle login logic
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the form

  console.log("printing the body", req.body);

  // Search user in MongoDB by email
  let user = await User.findOne({ email });

  // If user not found or password doesn't match, reload login page
  if (!user) res.render("login.ejs");
  else if (user.password != password) {
    res.render("login.ejs");
  } else {
    // If login is successful, render profile page and pass user data
    res.render('profile.ejs', { user });
  }
});

// Set server port
const port = 1000;

// Start the server and listen on the defined port
app.listen(port, () => console.log(`Server is running on port ${port}`));
