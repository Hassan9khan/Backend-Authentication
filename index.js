import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./src/routes/userRoute.js"
import productRouter from "./src/routes/productRoute.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("E-Commerce App Backend");
});

// routes
app.use("/api/", userRouter);
app.use("/api/", productRouter);




connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection failed ", error);
  });
