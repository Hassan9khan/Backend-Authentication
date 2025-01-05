import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./src/routes/userRoute.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello chalo");
});

// routes
app.use("/api/users", router);




connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection failed ", error);
  });
