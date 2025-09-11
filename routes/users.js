const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관리 API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 조회
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/users - 모든 사용자 조회
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: 특정 사용자 조회
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/users/:userId - 특정 사용자 조회
router.get("/:userId", userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 새 사용자 생성
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userName
 *               - password
 *               - nickname
 *               - schoolName
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자 ID (로그인 시 사용)
 *                 example: "student123"
 *               userName:
 *                 type: string
 *                 description: 사용자 실제 이름
 *                 example: "홍길동"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "mySecurePassword123"
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *                 example: "길동이"
 *               schoolName:
 *                 type: string
 *                 description: 소속 학교명
 *                 example: "서울대학교"
 *               points:
 *                 type: number
 *                 description: 사용자 포인트
 *                 example: 0
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/users - 새 사용자 생성
router.post("/", userController.createUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: 사용자 정보 수정
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: 사용자 실제 이름
 *                 example: "김철수"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "newPassword123"
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *                 example: "철수왕"
 *               schoolName:
 *                 type: string
 *                 description: 소속 학교명
 *                 example: "연세대학교"
 *               points:
 *                 type: number
 *                 description: 사용자 포인트
 *                 example: 150
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /api/users/:userId - 사용자 정보 수정
router.put("/:userId", userController.updateUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /api/users/:userId - 사용자 삭제
router.delete("/:userId", userController.deleteUser);

module.exports = router;
