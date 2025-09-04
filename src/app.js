const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("../config/database");
const { swaggerUi, specs } = require("../config/swagger");
require("dotenv").config();

// MongoDB 연결
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 설정
app.use(morgan("combined")); // 로깅
app.use(express.json({ limit: "10mb" })); // JSON 파싱
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // URL 인코딩 파싱

// 정적 파일 제공 (선택사항)
app.use("/public", express.static("public"));

/**
 * @swagger
 * /:
 *   get:
 *     summary: 서버 상태 확인
 *     description: Express 서버가 정상적으로 실행되고 있는지 확인합니다.
 *     responses:
 *       200:
 *         description: 서버가 정상적으로 실행 중
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 서버 상태 메시지
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: 응답 시간
 *                 environment:
 *                   type: string
 *                   description: 현재 환경
 */
// 기본 라우터
app.get("/", (req, res) => {
  res.json({
    message: "Express 서버가 정상적으로 실행되고 있습니다!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Swagger 문서 설정
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Node.js Express API Documentation",
  })
);

// API 라우터
app.use("/api/users", require("../routes/users"));
app.use("/api/auth", require("../routes/auth")); // 인증 라우터 추가
app.use("/api/lectures", require("../routes/lectures"));
app.use("/api/grades", require("../routes/grades"));
app.use("/api/friends", require("../routes/friend"));
app.use("/api/schedule", require("../routes/schedule"));
app.use("/api/comments", require("../routes/comment"));
app.use("/api/posts", require("../routes/post"));

// 404 에러 핸들링
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `경로 ${req.originalUrl}을 찾을 수 없습니다.`,
  });
});

// 글로벌 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 환경: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

module.exports = app;
