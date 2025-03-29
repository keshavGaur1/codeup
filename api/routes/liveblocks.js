import express from 'express';
import { Liveblocks } from "@liveblocks/node";

const router = express.Router();

const liveblocks = new Liveblocks({
  secret: "sk_dev_ZPAScSJskGeYmZS90myZDXGi8K78elMckz1MM2X2w-_3gcwijqZ1uWmTlsIUPP9a"
});

router.post("/liveblocks-auth", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { room } = req.body;
  
  const session = liveblocks.prepareSession(req.session.userId.toString(), {
    userInfo: {
      name: req.session.user?.name,
      picture: req.session.user?.avatar,
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { token } = await session.authorize();
  res.json({ token });
});

export default router;