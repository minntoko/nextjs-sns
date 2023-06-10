const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PORT = 8000;

const prisma = new PrismaClient

app.use(express.json());

// 新規ユーザー登録API
app.post("/api/auth/register", async (req, res) => {
    const { userName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      }
    });
    return res.json({user});
});

// ユーザーログインAPI
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({where: {email}});
  if (!user) {
    return res.status(401).json({error: "ユーザーが見つかりません"});
  }

  const isPasswordVaild = await bcrypt.compare(password, user.password);
  if (!isPasswordVaild) {
    return res.status(401).json({error: "パスワードが間違っています"});
  }

  const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({token});
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));