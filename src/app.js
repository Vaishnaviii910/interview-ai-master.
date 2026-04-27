const express = require("express")
 const cookieparser = require("cookie-parser")
const cors = require("cors")


const app = express()


app.use(express.json())
app.use(cookieparser())
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://interview-ai-master-ikx9.vercel.app"
  ],
  credentials: true
}));

app.options("*", cors());
/* require all the routes here */
const authRouter = require('./route/auth.routes')
const interviewRouter = require('./route/interview.routes')



// using all the routes here
app.use("/api/auth",authRouter)
app.use("/api/interview", interviewRouter )

module.exports = app