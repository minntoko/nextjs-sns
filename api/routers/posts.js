const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const prisma = new PrismaClient();

// つぶやき投稿用API
router.post("/post", async (req, res) => {
  const { content } = req.body;

  if(!content) {
    return res.status(400).json({ message: "投稿内容がありません" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: 1,
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// 最新つぶやき取得用API
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return res.status(401).json({ error: "ユーザーが見つかりません" });
//   }

//   const isPasswordVaild = await bcrypt.compare(password, user.password);
//   if (!isPasswordVaild) {
//     return res.status(401).json({ error: "パスワードが間違っています" });
//   }

//   const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
//     expiresIn: "1d",
//   });

//   return res.json({ token });
// });

module.exports = router;
