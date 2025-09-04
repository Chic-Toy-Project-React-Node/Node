//게시물 CRUD 로직처리
const asyncHandler = require("express-async-handler");
const Post = require("../models/Post"); //게시물
const comment = require("../models/PostComment"); //댓글

//게시물

//GETALL
const getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  if (posts.length === 0) {
    return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
  }
  res.status(200).json({ posts });
});

//GET/:Id 렌더링
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
  }
  res.status(200).json({ post });
});

//POST 생성
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ message: "제목, 내용, 카테고리를 모두 입력해주세요." });
  }
  const post = await Post.create({
    title,
    content,
    category,
  });
  res.status(201).json({ message: "게시물이 작성되었습니다.", post });
});

//UPDATE
const updatePost = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, category, content } = req.body; //req.body(입력) 받기
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: "검색 결과가 없습니다." });
  }

  post.title = title;
  post.category = category;
  post.content = content;
  await post.save();
  res.status(200).json({ message: "게시물이 수정되었습니다.", post });
});

//DELETE
const deletePost = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    return res.status(404).json({ message: "삭제할 게시물이 없습니다." });
  }
  res.status(200).json({ message: "게시물이 삭제되었습니다." });
});

module.exports = {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
