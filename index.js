import express, { json } from "express"
import router from "./routes/userRoute.js"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()


const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use("/api/users" , router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})