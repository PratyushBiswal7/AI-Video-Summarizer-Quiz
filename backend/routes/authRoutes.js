const router = require("express").Router();
const { signup, login, me } = require("../controllers/authController");
const { auth } = require("../utils/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, me);

module.exports = router;
