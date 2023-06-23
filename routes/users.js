const express = require("express");
const router = express.Router();
const { Users } = require("../models");

router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;
  const regExp1 = /^[a-zA-z0-9]{3,12}$/;
  const regExp2 =
    /^[A-Za-z0-9`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?]{4,16}$/;
  if (!regExp1.test(nickname)) {
    res.status(400).json({
      errorMessage: "닉네임은 영문 대소문자와 숫자 3~12자리로 입력해주세요.",
    });
    return;
  }

  if (!regExp2.test(password) || password.includes(nickname)) {
    res.status(400).json({
      errorMessage: "비밀번호 오류",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  const existsUsers = await Users.findOne({ where: { nickname: nickname } });

  if (existsUsers) {
    res.status(400).json({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  const user = await Users.create({ nickname, password });

  res.status(201).json({ result: user });
});

module.exports = router;
