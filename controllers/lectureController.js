const Lecture = require("../models/Lecture");
const LectureComment = require("../models/LectureComment");

exports.createLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.create(req.body);
    res.status(201).json({ ok: true, data: lecture });
  } catch (err) {
    next(err);
  }
};

exports.getLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find().lean();
    res.json({ ok: true, data: lectures });
  } catch (err) {
    next(err);
  }
};

exports.getLectureById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findById(id).lean();
    if (!lecture) return res.status(404).json({ ok: false, message: "Lecture not found" });

    const comments = await LectureComment.find({ lectureId: lecture._id }).lean();
    const avgRating = comments.length
      ? Number((comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(2))
      : null;

    res.json({
      ok: true,
      data: { ...lecture, ratingStats: { avgRating, count: comments.length } },
    });
  } catch (err) {
    next(err);
  }
};

exports.createLectureComment = async (req, res, next) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId).lean();
    if (!lecture) {
      return res.status(404).json({ ok: false, message: "Lecture not found" });
    }

    req.body.lectureId = lectureId;

    const comment = await LectureComment.create(req.body);
    res.status(201).json({ ok: true, data: comment });
  } catch (err) {
    next(err);
  }
};

exports.getLectureComments = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const comments = await LectureComment.find({ lectureId }).lean();
    res.json({ ok: true, data: comments });
  } catch (err) {
    next(err);
  }
};