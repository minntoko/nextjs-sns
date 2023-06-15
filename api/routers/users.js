const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = require("express").Router();

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      res.status(404).json({ error: "ユーザーが見つかりませんでした。" });
    }

    res.status(200).json({
      user: { id: user.id, userName: user.userName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        user: true,
      },
    });
    if (!profile) {
      res.status(404).json({ message: "ユーザーが見つかりませんでした。" });
    }
    const userProfile = {
      id: profile.id,
      bio: profile.bio,
      profileImageUrl: profile.profileImageUrl,
      userId: profile.userId,
      user: {
        id: profile.user.id,
        userName: profile.user.userName,
        email: profile.user.email,
      },
    };
    res.status(200).json(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
