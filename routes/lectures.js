const express = require("express");
const router = express.Router();
const lectureCtrl = require("../controllers/lectureController");

/**
 * @swagger
 * tags:
 *   name: Lectures
 *   description: 강의 관리 API
 */

/**
 * @swagger
 * /api/lectures:
 *   post:
 *     summary: 새 강의 생성
 *     description: 새로운 강의를 생성합니다. _id는 서버에서 자동으로 생성됩니다.
 *     tags: [Lectures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lectureName
 *               - professor
 *               - credit
 *               - department
 *               - userId
 *             properties:
 *               lectureName:
 *                 type: string
 *                 description: 강의명
 *                 example: "자료구조론"
 *               professor:
 *                 type: string
 *                 description: 교수명
 *                 example: "김교수"
 *               credit:
 *                 type: number
 *                 description: 학점
 *                 minimum: 0.5
 *                 maximum: 6
 *                 example: 3
 *               department:
 *                 type: string
 *                 description: 개설학과
 *                 example: "컴퓨터공학과"
 *               userId:
 *                 type: string
 *                 description: 강의를 등록한 사용자 ID
 *                 example: "student123"
 *     responses:
 *       201:
 *         description: 강의 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", lectureCtrl.createLecture);

/**
 * @swagger
 * /api/lectures:
 *   get:
 *     summary: 모든 강의 조회
 *     tags: [Lectures]
 *     responses:
 *       200:
 *         description: 강의 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lecture'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", lectureCtrl.getLectures);

/**
 * @swagger
 * /api/lectures/{id}:
 *   get:
 *     summary: 특정 강의 조회
 *     tags: [Lectures]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 강의 ID
 *     responses:
 *       200:
 *         description: 강의 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       404:
 *         description: 강의를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", lectureCtrl.getLectureById);

/**
 * @swagger
 * /api/lectures/{lectureId}/comments:
 *   post:
 *     summary: 강의에 댓글 추가
 *     description: 강의에 새로운 평가 댓글을 추가합니다. _id는 서버에서 자동으로 생성됩니다.
 *     tags: [Lectures]
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         schema:
 *           type: string
 *         required: true
 *         description: 강의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - evaluationContent
 *               - rating
 *               - semester
 *               - author
 *             properties:
 *               evaluationContent:
 *                 type: string
 *                 description: 평가 내용
 *                 example: "정말 좋은 강의입니다. 교수님이 친절하세요."
 *               rating:
 *                 type: number
 *                 description: 평점 (1-5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               semester:
 *                 type: string
 *                 description: 수강 학기
 *                 example: "2024-1"
 *               author:
 *                 type: string
 *                 description: 작성자 ID
 *                 example: "student123"
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:lectureId/comments", lectureCtrl.createLectureComment);

/**
 * @swagger
 * /api/lectures/{lectureId}/comments:
 *   get:
 *     summary: 강의의 모든 댓글 조회
 *     tags: [Lectures]
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         schema:
 *           type: string
 *         required: true
 *         description: 강의 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:lectureId/comments", lectureCtrl.getLectureComments);

module.exports = router;
