import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).end("Welcome to server using Express");
});

const PORT = process.env.PORT || 8888;
const HOST = process.env.HOST || "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});