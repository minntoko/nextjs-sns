const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();

const PORT = 8000;

const prisma = new PrismaClient

// 新規ユーザー登録API
app.post("/api/auto/register", async (req, res) => {
    const { userName, email, password } = req.body;

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password,
      }
    });
    return res.json({user});
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));