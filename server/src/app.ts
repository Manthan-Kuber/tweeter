import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import {MongoClient} from "mongodb";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;
const mongoURL:string = String(process.env.MONGODB_URI);
const client: MongoClient  = new MongoClient(mongoURL);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Pel Dunga");
});

app.listen(port, async(): Promise<void> => {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
} catch (e) {
    console.error(e);
}
  console.log(`🐵 Server Running at http://localhost:${port} 🐵`);
});
