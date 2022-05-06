import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Pel Dunga");
});

app.listen(port, (): void => {
  console.log(`🐵 Server Running at http://localhost:${port} 🐵`);
});
