import express from "express";
import * as adminController from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes here require authentication + admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/contests", adminController.getAllContests);
// Create a contest
router.post("/contests", adminController.createContest);

// Start / Activate a contest
router.post("/contests/:contestId/start", adminController.startContest);

// // (Optional) Add questions to a contest
// router.post("/contests/:contestId/questions", adminController.addQuestionsToContest);

// // (Optional) Update a contest
// router.put("/contests/:contestId", adminController.updateContest);

// // (Optional) Delete a contest
// router.delete("/contests/:contestId", adminController.deleteContest);

export default router;