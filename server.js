import express from 'express';
import donenv from 'dotenv';
import bootcamps from './routes/bootcamps.js';


// load evn vars
donenv.config({ path: './config/config.env' });

const app = express();

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the PORT ${PORT}`)); 