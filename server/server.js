import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';

//APP config for running the server on the port everything save on .env file
const PORT = process.env.Port || 4000;
const app = express();
await connectDB();

//middlewares
app.use(express());  //parse the json data of web
app.use(cors()); // used for connect multiple servers

//create api the routes
app.get('/',(req,res) =>res.send("Api working"));
app.use('/api/user',userRouter)

app.listen(PORT,()=> console.log("server starts on port " + PORT));