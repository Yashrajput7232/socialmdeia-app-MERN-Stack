import express from "express";  // Import the Express.js framework.
import bodyParser from "body-parser";  // Middleware for parsing request bodies.
import mongoose from "mongoose";  // MongoDB ODM (Object Document Mapper).
import cors from "cors";  // Middleware for handling Cross-Origin Resource Sharing.
import dotenv from "dotenv";  // Load environment variables from a .env file.
import multer from "multer";  // Middleware for handling file uploads.
import morgan from "morgan";  // HTTP request logger middleware.
import path from "path";  // Node.js module for working with file paths.
import helmet from "helmet";  // Middleware for adding security HTTP headers.
import { fileURLToPath } from "url";  // A utility function for working with file URLs.
import { register } from "controllers/auth.js"; 
// Get the current filename and dirname using the 'import.meta.url' object.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a .env file into process.env.
dotenv.config();

// Create an instance of the Express application.
const app = express();

// Middleware for parsing JSON request bodies.
app.use(express.json());

// Middleware for adding security HTTP headers.
app.use(helmet());

// Middleware for specifying Cross-Origin Resource Sharing (CORS) policy.
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }));

// Middleware for logging HTTP requests (common format).
app.use(morgan("common"));

// Middleware for parsing JSON request bodies with a size limit of 30MB.
app.use(bodyParser.json({ limit: '30mb', extend: true }));

// Middleware for parsing URL-encoded request bodies with a size limit of 30MB.
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Middleware for handling Cross-Origin Resource Sharing (CORS).
app.use(cors());

// Serve static files located in the "public/assets" directory under the "/assets" route.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// The code above sets up the necessary middleware for your Express application.

/* FILE STORAGE */

// Define a storage configuration for multer, a middleware for handling file uploads.
const storage = multer.diskStorage({
    // Destination function determines where to save the uploaded file.
    destination: function (req, file, cb) {
      // In this case, we save the file in the "public/assets" directory.
      cb(null, "public/assets");
    },
    // Filename function determines how to name the uploaded file on the server.
    filename: function (req, file, cb) {
      // Use the original name of the uploaded file as its name on the server.
      cb(null, file.originalname);
    },
  });
  
// Create a multer middleware instance with the storage configuration defined earlier.

  const upload=multer({storage})


  /* Mongoose Setup */

// Define a default port number (6001) or use the one specified in the environment variables.
const PORT = process.env.PORT || 6001;
// Connect to the MongoDB database using the MONGO_URL specified in the environment variables.
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start the Express.js server and listen on the specified port.
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // You can uncomment and use these lines to add data to your database if needed.
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => {
    // If there's an error connecting to the database, log the error message.
    console.log(`${error} did not connect`);
  });
