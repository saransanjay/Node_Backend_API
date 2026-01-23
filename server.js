import express from 'express';
import donenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';

// load evn vars
donenv.config({ path: './config/config.env' });

// Connect to database
connectDB();
// Route files
import bootcamps from './routes/bootcamps.js';


const app = express();

////  Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}



//// Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the PORT ${PORT}`));

///  Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    ////  Close server & exist process
    server.close(() => process.exit(1));
})