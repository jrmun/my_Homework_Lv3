const express = require("express");
const router = express.Router();
const { Posts, Users } = require("../models");
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware.js");

router.get("/posts", async (req, res) => {
  const postlist = await Posts.findAll({
    attributes: ["title", "createdAt"],
    include: [
      {
        model: Users,
        attributes: ["nickname"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({ data: postlist });
});

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: ["title", "createdAt", "content"],
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
      where: { postId: postId },
    });
    res.status(200).json({ delail: post });
  } catch (err) {
    console.error(err);
  }
});

router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const UserId = res.locals.user.userId;
  const createdPost = await Posts.create({ title, UserId, content });
  res.json({ result: createdPost });
});

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const userId = res.locals.user.userId;
  const existsPosts = await Posts.findOne({ where: { postId } });
  if (existsPosts) {
    if (existsPosts.UserId === userId) {
      await Posts.update(
        { title, content },
        {
          where: {
            [Op.and]: [{ postId }, { userId }],
          },
        }
      );
      res.json({ success: true });
    } else {
      res.json({ success: "false", errorMessage: "작성한 사용자가 아닙니다." });
    }
  } else {
    res.json({ success: "false", errorMessage: "게시글을 찾을 수 없습니다." });
  }
});

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = res.locals.user.userId;
  const existsPosts = await Posts.findOne({ where: { postId } });
  if (existsPosts) {
    if (existsPosts.UserId === userId) {
      await Posts.destroy({ where: { postId } });
      res.json({ result: "success" });
    } else {
      res.json({ result: "false", errorMessage: "작성한 사용자가 아닙니다." });
    }
  } else {
    res.json({ result: "false", errorMessage: "존재하지 않는 게시글입니다.." });
  }
});

module.exports = router;
