import express from 'express';
import donenv from 'dotenv';

// load evn vars
donenv.config({ path: './config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on the PORT ${PORT}`)); 