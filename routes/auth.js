const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

//로그인 기능
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await Users.findOne({ where: { nickname } });
  if (!user || user.password !== password) {
    res.status(400).json({ errorMessage: "로그인 실패" });
    return;
  }
  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");
  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;
