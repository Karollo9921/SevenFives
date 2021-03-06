import mongoose from 'mongoose';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import dotenv from 'dotenv';


dotenv.config();
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: 'sessions'
});


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
          });
        console.log(`MongoDB Connected: ${connection.connection.host}`);
        
        // db = Mongoose.connection;
        
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};


export { connectDB, store };