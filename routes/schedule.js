const express = require("express");
const UserLecture = require("../models/UserLecture");
const Lecture = require("../models/Lecture");
const Time = require("../models/Time");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: 시간표 관리 API
 */

/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: 내 시간표 조회
 *     description: 현재 로그인한 사용자의 전체 시간표를 요일별로 조회합니다.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 시간표 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "시간표 조회 성공"
 *                 schedule:
 *                   $ref: '#/components/schemas/WeeklySchedule'
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

    const schedule = await UserLecture.find({ userId })
      .populate("lectureId", "lectureName professor credit department")
      .populate("lectureTimeId", "startTime endTime lectureNumber")
      .lean();

    // 요일별로 정리
    const weeklySchedule = {
      0: [], // 일요일
      1: [], // 월요일
      2: [], // 화요일
      3: [], // 수요일
      4: [], // 목요일
      5: [], // 금요일
      6: [], // 토요일
    };

    schedule.forEach((item) => {
      weeklySchedule[item.dayOfWeek].push({
        lectureId: item.lectureId._id,
        lectureName: item.lectureId.lectureName,
        professor: item.lectureId.professor,
        credit: item.lectureId.credit,
        department: item.lectureId.department,
        startTime: item.lectureTimeId?.startTime,
        endTime: item.lectureTimeId?.endTime,
        lectureNumber: item.lectureTimeId?.lectureNumber,
        classroom: item.classroom,
      });
    });

    return res.status(200).json({
      message: "시간표 조회 성공",
      schedule: weeklySchedule,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /api/schedule/{lectureId}:
 *   get:
 *     summary: 특정 강의 정보 조회
 *     description: 강의 ID로 특정 강의의 상세 정보를 조회합니다.
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         description: 조회할 강의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 강의 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "강의 조회 성공"
 *                 lecture:
 *                   $ref: '#/components/schemas/Lecture'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 강의를 찾을 수 없음
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
router.get("/:lectureId", async (req, res) => {
  try {
    const lectureId = String(req.params.lectureId || "").trim();

    if (!lectureId) {
      return res.status(400).json({ message: "강의 ID를 입력해주세요." });
    }

    const lecture = await Lecture.findById(lectureId).lean();

    if (!lecture) {
      return res.status(404).json({ message: "강의를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "강의 조회 성공",
      lecture,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /api/schedule/{lectureId}:
 *   post:
 *     summary: 시간표에 강의 추가
 *     description: 사용자의 시간표에 새로운 강의를 추가합니다. 이미 수강 중인 강의나 시간이 겹치는 강의는 추가할 수 없습니다.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         description: 추가할 강의 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: 강의 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "시간표에 강의가 추가되었습니다."
 *                 userLecture:
 *                   type: object
 *                   description: 추가된 수강 정보
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
 *         description: 강의 또는 강의 시간을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 이미 수강 중이거나 시간 충돌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 conflictLecture:
 *                   type: string
 *                   description: 충돌하는 강의 ID (시간 충돌 시)
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:lectureId", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "먼저 로그인하세요." });
    }

    const userId = String(req.user.id).trim();
    const lectureId = String(req.params.lectureId || "").trim();
    const { lectureTimeId, dayOfWeek, classroom = "" } = req.body;

    if (!lectureId) {
      return res.status(400).json({ message: "강의 ID를 입력해주세요." });
    }

    if (!lectureTimeId) {
      return res.status(400).json({ message: "강의 시간 ID를 입력해주세요." });
    }

    if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
      return res
        .status(400)
        .json({ message: "올바른 요일을 입력해주세요. (0-6)" });
    }

    // 강의 존재 확인
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "존재하지 않는 강의입니다." });
    }

    // 강의 시간 존재 확인
    const time = await Time.findOne({ lectureTimeId });
    if (!time) {
      return res
        .status(404)
        .json({ message: "존재하지 않는 강의 시간입니다." });
    }

    // 이미 수강 중인지 확인
    const existingEnrollment = await UserLecture.findOne({ userId, lectureId });
    if (existingEnrollment) {
      return res.status(409).json({ message: "이미 수강 중인 강의입니다." });
    }

    // 해당 시간에 다른 강의가 있는지 확인
    const timeConflict = await UserLecture.findOne({
      userId,
      dayOfWeek,
      lectureTimeId,
    }).populate("lectureTimeId");

    if (timeConflict) {
      return res.status(409).json({
        message: "해당 시간에 이미 다른 강의가 있습니다.",
        conflictLecture: timeConflict.lectureId,
      });
    }

    // 시간표에 추가
    const newUserLecture = new UserLecture({
      userId,
      lectureId,
      lectureTimeId,
      dayOfWeek,
      classroom,
    });

    await newUserLecture.save();

    return res.status(201).json({
      message: "시간표에 강의가 추가되었습니다.",
      userLecture: newUserLecture,
    });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(409).json({ message: "이미 수강 중인 강의입니다." });
    }
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /api/schedule/{lectureId}:
 *   delete:
 *     summary: 시간표에서 강의 삭제
 *     description: 사용자의 시간표에서 특정 강의를 삭제합니다.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         description: 삭제할 강의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 강의 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "시간표에서 강의가 삭제되었습니다."
 *                 lectureId:
 *                   type: string
 *                   description: 삭제된 강의 ID
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
 *         description: 수강 중이지 않은 강의
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
router.delete("/:lectureId", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "먼저 로그인하세요." });
    }

    const userId = String(req.user.id).trim();
    const lectureId = String(req.params.lectureId || "").trim();

    if (!lectureId) {
      return res.status(400).json({ message: "강의 ID를 입력해주세요." });
    }

    const result = await UserLecture.deleteOne({ userId, lectureId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "수강 중이지 않은 강의입니다." });
    }

    return res.status(200).json({
      message: "시간표에서 강의가 삭제되었습니다.",
      lectureId,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
