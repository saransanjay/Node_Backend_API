import fs from "fs";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

////   Load the evn vars
dotenv.config({ path: './config/config.env' });


///   Load models
import Bootcamps from "./models/Bootcamp.js";
import Courses from "./models/Course.js";
import User from "./models/User.js";



//  Connect to DB
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(process.env.MONGO_URI, clientOptions);

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${import.meta.dirname}/_data/bootcamps.json`, `utf-8`));
const courses = JSON.parse(fs.readFileSync(`${import.meta.dirname}/_data/courses.json`, `utf-8`));
const users = JSON.parse(fs.readFileSync(`${import.meta.dirname}/_data/users.json`, `utf-8`));


///  Import into DB 
const importData = async () => {
    try {
        await Bootcamps.create(bootcamps)
        await Courses.create(courses)
        await users.create(users);

        console.log('\x1b[32m', `Data Imported....`);
    } catch (error) {
        console.log(error);
    }
}

///  Import into DB 
const deleteData = async () => {
    try {
        await Bootcamps.deleteMany();
        await Courses.deleteMany();
        await User.deleteMany();

        console.log('\x1b[31m', `Data Destoryed....`);
    } catch (error) {
        console.log(error);
    }
}

if (process.argv[2] == `-i`) {
    importData();
}
else if (process.argv[2] == `-d`) {
    deleteData();
}
