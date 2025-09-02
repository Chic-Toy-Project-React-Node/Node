const express = require("express");
const asyncHandler = require("express-async-handler");
const Friend = require("../models/Friend.js");
const User = require("../models/User.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "먼저 로그인하세요." });
    }

    const userId = String(req.user.id).trim();

    const rows = await Friend.find({ userId })
      .populate("friendId", "userId userName nickname")
      .select({ friendId: 1, _id: 0 })
      .lean();

    return res.status(200).json({
      count: rows.length,
      items: rows.map((r) => r.friendId),
      ...(rows.length === 0
        ? { message: "아직 친구 맺은 사용자가 없습니다." }
        : {}),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const userId = String(req.params.userId || "").trim();

    if (!userId) {
      return res
        .status(400)
        .json({ message: "친구 맺을 사용자를 검색해주세요." });
    }

    const user = await User.findOne({ userId }).select("-password -__v").lean();

    if (!user) {
      return res.status(404).json({ message: "일치하는 사용자가 없습니다." });
    }

    return res.status(200).json({ user });
  })
);

router.post("/me/:friendId", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "먼저 로그인하세요." });
    }

    const userId = String(req.user.id).trim();
    const friendId = String(req.params.friendId || "").trim();

    if (!friendId) {
      return res.status(400).json({ message: "친구 이름을 입력해주세요." });
    }
    if (friendId === userId) {
      return res
        .status(400)
        .json({ message: "자기 자신은 추가할 수 없습니다." });
    }

    // 친구가 실제로 존재하는지 확인
    const friendUser = await User.findOne({ userId: friendId });
    if (!friendUser) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    await Friend.create({ userId, friendId: friendUser._id });
    return res.status(201).json({ message: "Friend added", friendId });
  } catch (e) {
    if (e && e.code === 11000) {
      return res
        .status(409)
        .json({ message: "이미 친구입니다.", friendId: req.params.friendId });
    }
    console.error(e);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.delete("/me/:friendId", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "먼저 로그인하세요." });
    }

    const userId = String(req.user.id).trim();
    const friendId = String(req.params.friendId || "").trim();

    // 친구 사용자 찾기
    const friendUser = await User.findOne({ userId: friendId });
    if (!friendUser) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const r = await Friend.deleteOne({ userId, friendId: friendUser._id });

    if (r.deletedCount === 0)
      return res.status(404).json({ message: "친구가 아닙니다." });

    return res.status(200).json({ message: "Friend removed", friendId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
