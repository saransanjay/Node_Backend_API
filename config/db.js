import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, clientOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

export default connectDB;