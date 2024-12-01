import express from "express"
import dotenv from "dotenv"
import router from "./routes/userRoute.js"
dotenv.config()
const app = express()
const port = process.env.PORT

app.use("/api/users" , router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})