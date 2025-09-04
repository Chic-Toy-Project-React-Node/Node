const mongoose = require("mongoose");

const UserLectureSchema = new mongoose.Schema(
  {
    // FK: 사용자 ID
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    // FK: 강의 ID
    lectureId: {
      type: String,
      ref: "Lecture",
      required: true,
      index: true,
    },
    // FK: 강의 시간 ID (Time 모델 참조)
    lectureTimeId: {
      type: String,
      ref: "Time",
      required: true,
      index: true,
    },
    // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    // 강의실
    classroom: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// 유효성 검증
UserLectureSchema.path("userId").validate({
  validator: async function (val) {
    const User = mongoose.model("User");
    return !!(await User.exists({ _id: val }));
  },
  message: "userId not found",
});

UserLectureSchema.path("lectureId").validate({
  validator: async function (val) {
    const Lecture = mongoose.model("Lecture");
    return !!(await Lecture.exists({ _id: val }));
  },
  message: "lectureId not found",
});

UserLectureSchema.path("lectureTimeId").validate({
  validator: async function (val) {
    const Time = mongoose.model("Time");
    return !!(await Time.exists({ lectureTimeId: val }));
  },
  message: "lectureTimeId not found",
});

// 중복 수강 방지를 위한 복합 인덱스
UserLectureSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model("UserLecture", UserLectureSchema);
