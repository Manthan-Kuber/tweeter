import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import authRoutes from "./routes/authRoutes";
import privRoutes from "./routes/privateRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(cors());

//Instead of body parser
app.use(express.json());

app.use(cookieParser());

//Including Routers

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Pel Dunga");
});

app.use(authRoutes);
app.use(privRoutes);
// app.set("view engine",viewEngine_name)

app.listen(port, async (): Promise<void> => {
  try {
    await connect(process.env.MONGODB_URI!);
    console.log("Successfully connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
  console.log(`🐵 Server Running at http://localhost:${port} 🐵`);
});
