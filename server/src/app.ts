import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import {connect} from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;
const mongoURL:string = String(process.env.MONGODB_URI);

//Instead of body parser
app.use(express.json())

//Including Routers

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Pel Dunga");
});

app.use(authRoutes)

// app.set("view engine",viewEngine_name)

app.listen(port, async(): Promise<void> => {
  try {
    await connect(mongoURL);
    console.log('Successfully connected to MongoDB');
} catch (e) {
    console.error(e);
}
  console.log(`🐵 Server Running at http://localhost:${port} 🐵`);
});
