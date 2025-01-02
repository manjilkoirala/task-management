import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
import connectDB from "./db";
import app from "./app";

connectDB();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
