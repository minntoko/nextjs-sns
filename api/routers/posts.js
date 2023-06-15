const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = require("express").Router();

const prisma = new PrismaClient();

// つぶやき投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// 最新つぶやき取得用API
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(200).json(latestPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// その閲覧しているユーザーの投稿内容だけを取得
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      },
    });
    const userPosts = posts.map((post) => {
      return {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        authorId: post.authorId,
        author: {
          id: post.author.id,
          userName: post.author.userName,
          email: post.author.email,
        },
      };
    });
    res.status(200).json(userPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

module.exports = router;
