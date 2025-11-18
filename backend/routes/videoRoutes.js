const router = require("express").Router();
const { auth } = require("../utils/authMiddleware");
const {
  processVideo,
  history,
  deleteVideo,
} = require("../controllers/videoController");

router.post("/process", auth, processVideo);
router.get("/history", auth, history);
router.delete("/history/:id", auth, deleteVideo);

module.exports = router;
