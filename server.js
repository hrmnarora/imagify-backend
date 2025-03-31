import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js'; // Ensure the correct path
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");

        app.get('/', (req, res) => res.send("API WORKING FINE"));

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Error starting server:", error.message);
    }
};

// Call the function to start the server
startServer();
