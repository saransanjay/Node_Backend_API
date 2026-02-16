import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import errorHandler from './middleware/error.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimt from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';


// import xss from 'xss-clean';

// load evn vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
import bootcamps from './routes/bootcamps.js';
import courses from './routes/courses.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import reviews from './routes/review.js';

const app = express();
app.set('query parser', 'extended');

////  Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

/// File Uploading
app.use(fileUpload());

/// Sanitize data 
app.use((req, res, next) => {
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.params);
    next();
});

/// Set security headers
app.use(helmet());

/// Prevent XSS attacks
// app.use(xss());

/// Rate Limiting
const limiter = rateLimt({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});
app.use(limiter);

/// Prevent http param pollution
app.use(hpp());

/// Enable CORS
app.use(cors());


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
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);



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
