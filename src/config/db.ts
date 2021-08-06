import mongoose from 'mongoose';

const connectDB = async () => {

    try {
        const uri = process.env.MONGO_URI!;
        const connection = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
          });

        console.log(`MongoDB Connected: ${connection.connection.host}`);
        
        // db = Mongoose.connection;
        
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}


export default connectDB;