const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateIdenticon = require("../utils/generateIdenticon");
const router = require("express").Router();

const prisma = new PrismaClient();

// 新規ユーザー登録API
router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  const defaultIconImage = generateIdenticon(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      userName,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: "はじめまして",
          profileImageUrl: defaultIconImage,
        },
      },
    },
    include: {
      profile: true,
    }
  });
  return res.json({ user });
});

// ユーザーログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "ユーザーが見つかりません" });
  }

  const isPasswordVaild = await bcrypt.compare(password, user.password);
  if (!isPasswordVaild) {
    return res.status(401).json({ error: "パスワードが間違っています" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

module.exports = router;
