const express = require("express");
const router = express.Router();

//원하는 수업 조회
router.get("/:lectureId", (req, res) => {
  res.send("Hello World!");
});
//시간표에 추가 - 이미 추가되어 있으면 안됨, 해당 시간에 다른 수업 추가되어있으면 안됨

//시간표에서 삭제

module.exports = router;
