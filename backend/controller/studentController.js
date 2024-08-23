import userModel from "../models/userModel.js";

//GET STUDENT PROFILE
export const getStudentProfileController = async (req, res) => {
    try {
        const user1 = req.student;
        const user = await userModel.find({rollNo:user1.rollNo});
        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Send the admin information in the response
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getStudentDetailsByRollNo = async (req, res) => {
  try {
      const { rollNo } = req.body;

      // Find the student by rollNo
      const student = await userModel.findOne({ rollNo });
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      // Return student details
      res.status(200).json(student);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

//GET ALL STUDENTS
export const getStudentsController = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

