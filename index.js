const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRouter = require("./routes/users");

dotenv.config();
//to enable env

main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("db connected"))
    .catch((error) => console.log("error", error));
}

app.use(express.json());
//to accept json

app.use("/api/auth", authRoute);
app.use("/api/users", userRouter);
// put all the  main routes here

app.listen(8800, () => {
  console.log("Backend is running");
});
