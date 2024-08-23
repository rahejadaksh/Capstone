import userModel from '../models/userModel.js'
import prescriptionModel from '../models/prescriptionModel.js'
import mongoose from 'mongoose'

//POST PRESCRIPTION
export const postPrescriptionController = async (req, res) => {
  try {
    const { medicines, rollNo } = req.body

    // Find the user by rollNo
    const user = await userModel.findOne({ rollNo })
    if (!user) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Create a new prescription for the found user
    const newPrescription = new prescriptionModel({
      medicines,
      student: user._id // Using user's _id as a reference
    })

    await newPrescription.save()

    res.status(201).json({ message: 'Prescription added successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

//GET PRESCRIPTION FOR STUDENT (Access by the student)
export const getPrescriptionStudentController = async (req, res) => {
  try {
    const userId = req.student._id
    const prescriptions = await prescriptionModel.find({ student: userId })
    res.json(prescriptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

//GET PRESCRIPTION FOR STUDENT BY ID (Access by the student)
export const getPrescriptionByIdStudentController = async (req, res) => {
  try {
    const id = req.params.prescriptionId
    const userId = req.student._id
    const prescriptions = await prescriptionModel.find({ _id: new mongoose.Types.ObjectId(id), student: userId })
    res.json(prescriptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

//GET PRESCRIPTION FOR STUDENT (Access by the doctor)
export const getPrescriptionDoctorController = async (req, res) => {
  try {
    const { rollNo } = req.body // Extract rollNo from the request body

    // Find the user by rollNo
    const user = await userModel.findOne({ rollNo })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Find all prescriptions for the found user
    const prescriptions = await prescriptionModel.find({ student: user._id })

    res.json(prescriptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

//GET PRESCRIPTION FOR STUDENT By ID(Access by the doctor)
export const getPrescriptionByIdDoctorController = async (req, res) => {
  try {
    const userId = req.params.id
    const id = req.params.prescriptionId
    const prescriptions = await prescriptionModel.find({ _id: new mongoose.Types.ObjectId(id), student: userId })
    res.json(prescriptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
