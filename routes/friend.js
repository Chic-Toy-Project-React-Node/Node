const express = require("express");
const asyncHandler = require("express-async-handler");
const Friend = require("../models/Friend.js");
const User = require("../models/User.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: 친구 관리 API
 */

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: 내 친구 목록 조회
 *     description: 현재 로그인한 사용자의 친구 목록을 조회합니다.
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 친구 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: 친구 수
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                   description: 친구 목록
 *                 message:
 *                   type: string
 *                   description: 메시지 (친구가 없을 때)
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/friends/{userId}:
 *   get:
 *     summary: 사용자 검색
 *     description: 친구 추가를 위해 사용자를 검색합니다.
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: 검색할 사용자 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 사용자 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/friends/me/{friendId}:
 *   post:
 *     summary: 친구 추가
 *     description: 현재 로그인한 사용자의 친구 목록에 새로운 친구를 추가합니다.
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         description: 추가할 친구의 사용자 ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 친구 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friend added"
 *                 friendId:
 *                   type: string
 *                   description: 추가된 친구 ID
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 이미 친구임
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 친구입니다."
 *                 friendId:
 *                   type: string
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/friends/me/{friendId}:
 *   delete:
 *     summary: 친구 삭제
 *     description: 현재 로그인한 사용자의 친구 목록에서 친구를 삭제합니다.
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         description: 삭제할 친구의 사용자 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 친구 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friend removed"
 *                 friendId:
 *                   type: string
 *                   description: 삭제된 친구 ID
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 사용자를 찾을 수 없음 또는 친구가 아님
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
