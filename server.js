import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import errorHandler from './middleware/error.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser';


// load evn vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
import bootcamps from './routes/bootcamps.js';
import courses from './routes/courses.js';
import auth from './routes/auth.js';

const app = express();
app.set('query parser', 'extended');

////  Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

/// File Uploading
app.use(fileUpload());

/// set Static Folders
app.use(express.static(path.join(import.meta.dirname, "public")))

//// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the PORT ${PORT}`));

///  Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    ////  Close server & exist process
    server.close(() => process.exit(1));
})
