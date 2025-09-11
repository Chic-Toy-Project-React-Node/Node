const express = require("express");
const loginController = require("../controllers/loginController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: 사용자 인증 관련 API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *                 example: "student123"
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: "mySecurePassword123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 토큰
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/auth/login - 로그인
router.post("/login", loginController.loginUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Authentication]
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
 *                 description: 사용자 비밀번호
 *                 example: "mySecurePassword123"
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *                 example: "길동이"
 *               schoolName:
 *                 type: string
 *                 description: 소속 학교명
 *                 example: "서울대학교"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/auth/register - 회원가입
router.post("/register", loginController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   get:
 *     summary: 로그인 페이지 요청
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: 로그인 페이지 반환
 */
// GET /api/auth/login - 로그인 페이지 (렌더링용)
router.get("/login", loginController.getLogin);

/**
 * @swagger
 * /api/auth/register:
 *   get:
 *     summary: 회원가입 페이지 요청
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: 회원가입 페이지 반환
 */
// GET /api/auth/register - 회원가입 페이지 (렌더링용)
router.get("/register", loginController.getRegister);

module.exports = router;
