const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema(
  {
    //FK 사용자 아이디, 사용자의 친구 아이디
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    friendId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

FriendSchema.path("userId").validate({
  validator: async function (val) {
    const User = mongoose.model("User");
    const exists = await User.exists({ _id: val });
    return !!exists;
  },
  message: "userId not found",
});

FriendSchema.path("friendId").validate({
  validator: async function (val) {
    const User = mongoose.model("User");
    const exists = await User.exists({ _id: val });
    return !!exists;
  },
  message: "friendId not found",
});

// 중복 친구 관계 방지를 위한 복합 인덱스
FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

module.exports = mongoose.model("Friend", FriendSchema);
