import express from "express";
import {
    getStudentProfileController,
    getStudentsController,
    getStudentDetailsByRollNo
} from "../controller/studentController.js";
import { requiresStudent } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//GET STUDENT PROFILE
router.get("/profile", requiresStudent ,getStudentProfileController);
router.post("/rollNo",getStudentDetailsByRollNo);

//GET ALL STUDENTS
router.get("/",getStudentsController)

export default router;
