const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3018;

const postsRouter = require("./routes/posts.js");
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", [postsRouter, userRouter, authRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});

// app.js
