const express = require("express");

// mergeParams: true → 부모 라우터의 :postId 파라미터를 이 라우터에서도 사용 가능
const router = express.Router({ mergeParams: true });

const {
  createComment,
  deleteComment,
} = require("../controllers/commentController");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관리 API
 */

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: 댓글 생성
 *     description: 특정 게시글에 새로운 댓글을 생성합니다.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: 댓글을 추가할 게시글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
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
router.post("/", createComment);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 댓글을 삭제합니다.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: 삭제할 댓글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "댓글이 삭제되었습니다."
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 댓글을 찾을 수 없음
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
router.delete("/:commentId", deleteComment);

module.exports = router;
