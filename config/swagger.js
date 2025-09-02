const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js Express API",
      version: "1.0.0",
      description: "Node.js Express 백엔드 API 문서",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "email"],
          properties: {
            id: {
              type: "string",
              description: "사용자 ID",
            },
            username: {
              type: "string",
              description: "사용자 이름",
            },
            email: {
              type: "string",
              format: "email",
              description: "이메일 주소",
            },
            password: {
              type: "string",
              description: "비밀번호",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "생성일시",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
            },
          },
        },
        Lecture: {
          type: "object",
          required: ["title", "description"],
          properties: {
            id: {
              type: "string",
              description: "강의 ID",
            },
            title: {
              type: "string",
              description: "강의 제목",
            },
            description: {
              type: "string",
              description: "강의 설명",
            },
            instructor: {
              type: "string",
              description: "강사명",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "생성일시",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
            },
          },
        },
        Grade: {
          type: "object",
          required: ["userId", "lectureId", "score"],
          properties: {
            id: {
              type: "string",
              description: "성적 ID",
            },
            userId: {
              type: "string",
              description: "사용자 ID",
            },
            lectureId: {
              type: "string",
              description: "강의 ID",
            },
            score: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "점수",
            },
            grade: {
              type: "string",
              description: "등급",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "생성일시",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
            },
          },
        },
        Comment: {
          type: "object",
          required: ["content", "author"],
          properties: {
            id: {
              type: "string",
              description: "댓글 ID",
            },
            content: {
              type: "string",
              description: "댓글 내용",
            },
            author: {
              type: "string",
              description: "작성자",
            },
            lectureId: {
              type: "string",
              description: "강의 ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "생성일시",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
            },
          },
        },
        Friend: {
          type: "object",
          required: ["userId", "friendId"],
          properties: {
            id: {
              type: "string",
              description: "친구 관계 ID",
            },
            userId: {
              type: "string",
              description: "사용자 ID",
            },
            friendId: {
              type: "string",
              description: "친구 사용자 ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "친구 추가일시",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "수정일시",
            },
          },
        },
        Schedule: {
          type: "object",
          required: ["lectureId", "lectureTimeId", "dayOfWeek"],
          properties: {
            lectureId: {
              type: "string",
              description: "강의 ID",
            },
            lectureTimeId: {
              type: "string",
              description: "강의 시간 ID",
            },
            dayOfWeek: {
              type: "integer",
              minimum: 0,
              maximum: 6,
              description: "요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)",
            },
            classroom: {
              type: "string",
              description: "강의실",
            },
          },
        },
        WeeklySchedule: {
          type: "object",
          properties: {
            0: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "일요일 시간표",
            },
            1: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "월요일 시간표",
            },
            2: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "화요일 시간표",
            },
            3: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "수요일 시간표",
            },
            4: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "목요일 시간표",
            },
            5: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "금요일 시간표",
            },
            6: {
              type: "array",
              items: { $ref: "#/components/schemas/ScheduleItem" },
              description: "토요일 시간표",
            },
          },
        },
        ScheduleItem: {
          type: "object",
          properties: {
            lectureId: {
              type: "string",
              description: "강의 ID",
            },
            lectureName: {
              type: "string",
              description: "강의명",
            },
            professor: {
              type: "string",
              description: "교수명",
            },
            credit: {
              type: "number",
              description: "학점",
            },
            department: {
              type: "string",
              description: "개설학과",
            },
            startTime: {
              type: "string",
              description: "시작 시간",
            },
            endTime: {
              type: "string",
              description: "종료 시간",
            },
            lectureNumber: {
              type: "string",
              description: "강의 번호",
            },
            classroom: {
              type: "string",
              description: "강의실",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "오류 메시지",
            },
            message: {
              type: "string",
              description: "상세 메시지",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./src/app.js"], // Swagger 주석이 있는 파일들의 경로
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
