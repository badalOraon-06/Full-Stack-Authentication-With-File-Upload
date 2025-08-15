// Importing necessary modules
import express from 'express'; // Express framework for building web applications
import mongoose from 'mongoose'; // Mongoose for interacting with MongoDB
import multer from 'multer'; // Multer for handling file uploads (multipart/form-data)
import path from 'path'; // Path module for handling file paths
import dotenv from 'dotenv'; // For loading environment variables

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }))

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Importing Cloudinary v2 for uploading files to the cloud
import { v2 as cloudinary } from 'cloudinary';

// Configuring Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connecting to MongoDB using Mongoose with environment variables
mongoose.connect(process.env.MONGODB_URI,
  { dbName: process.env.DB_NAME }) // Specify the database name from environment
  .then(() => console.log("Connected to MongoDB")) // Log success message
  .catch((err) => console.log(err)); // Log any error that occurs

// Route to serve login page
app.get('/', (req, res) => {
  const success = req.query.success;
  const error = req.query.error;
  res.render('login.ejs', { success, error }); // Pass success/error messages
});

// Route to serve registration page
app.get('/register', (req, res) => {
  res.render('register.ejs', { error: null }); // Renders register.ejs view with no error initially
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
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).render("register.ejs", { error: "Please select a profile image" });
    }

    const filePath = req.file.path; // Get the file path of the uploaded image

    // Extract form fields using destructuring
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("register.ejs", { error: "User already exists with this email" });
    }

    // Upload file to Cloudinary under folder "NodeJS_Mastery_Course"
    const cloudinaryRes = await cloudinary.uploader.upload(filePath, {
      folder: "NodeJS_Mastery_Cource"
    });

    // Save user data in MongoDB, along with cloudinary image info
    const newUser = await User.create({
      name,
      email,
      password,
      filename: req.file.originalname,              // Use req.file.originalname
      public_id: cloudinaryRes.public_id,          // Public ID for future access/delete
      imgUrl: cloudinaryRes.secure_url,            // Direct secure URL to access the image
    });

    console.log("User registered successfully:", newUser.email);
    
    // Redirect to login page after successful registration
    res.redirect('/?success=Registration successful! Please login.');
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).render("register.ejs", { error: "Registration failed. Please try again." });
  }
});

// POST route to handle login logic
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from the form

    console.log("Login attempt for email:", email);
    console.log("Request body:", req.body);

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).render("login.ejs", { error: "Please provide both email and password", success: null });
    }

    // Search user in MongoDB by email
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    // If user not found
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).render("login.ejs", { error: "Invalid email or password", success: null });
    }

    // If password doesn't match
    if (user.password !== password) {
      console.log("Invalid password for user:", email);
      console.log("Expected password:", user.password);
      console.log("Provided password:", password);
      return res.status(400).render("login.ejs", { error: "Invalid email or password", success: null });
    }

    // If login is successful
    console.log("Login successful for user:", email);
    res.render('profile.ejs', { user });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("login.ejs", { error: "Login failed. Please try again.", success: null });
  }
});

// Set server port from environment or default to 1000
const port = process.env.PORT || 1000;

// Start the server and listen on the defined port
app.listen(port, () => console.log(`Server is running on port ${port}`));
