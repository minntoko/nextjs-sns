const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = require("express").Router();

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({where: {id: req.userId}});

    if(!user) {
      res.status(404).json({error: "ユーザーが見つかりませんでした。"});
    }

    res.status(200).json({user: {id: user.id, userName: user.userName, email: user.email}})

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;