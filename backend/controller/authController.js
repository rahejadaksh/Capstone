import userModel from "../models/userModel.js";
import passwordResetModel from "../models/passwordResetModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  },
});

//POST register
export const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      rollNo,
      hostel,
      roomNo,
      phoneNo,
      bloodGroup,
      age,
      password,
    } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!rollNo) {
      return res.send({ message: "Roll No. is Required" });
    }
    if (!hostel) {
      return res.send({ message: "Hostel is Required" });
    }
    if (!roomNo) {
      return res.send({ message: "Room No. is Required" });
    }
    if (!phoneNo) {
      return res.send({ message: "Phone No. is Required" });
    }
    if (!bloodGroup) {
      return res.send({ message: "Blood Group is Required" });
    }
    if (!age) {
      return res.send({ message: "Age is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    //check user
    const exisitingUser = await userModel.findOne({ rollNo });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already exist, Please Login",
      });
    }

    //register user
    const h = await hashPassword(password);
    console.log("Saving:",h);
    //save
    const user = await new userModel({
      name,
      email,
      rollNo,
      hostel,
      roomNo,
      phoneNo,
      bloodGroup,
      age,
      password: h,
      role: 0,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please enter the credentials",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User is not registered",
      });
    }
    console.log("Entered password:", password);
    console.log("Stored password:", user.password);
    const match = await comparePassword(password, user.password);
    console.log("Password match:", match);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        rollNo: user.rollNo,
        email: user.email
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//POST RESET
export const resetController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const randomPassword = crypto.randomBytes(8).toString("hex");
    // const randomPassword= "admin"
    console.log(randomPassword)
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();
    const mailOptions = {
      from: "2dead1shot2@gmail.com",
      to: user.email,
      subject: "Set Password",
      text: `Here is your new password: ${randomPassword}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).send({
          success: false,
          message: "Error in sending mail",
          error,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "New password sent to your email",
          password: randomPassword
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const newPassController=async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Authorization token is required",
    });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Old password is incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// export const postPassController = async (req, res) => {
//   try {
//     const token = req.params.token;
//     const passwordReset = await passwordResetModel.findOne({ token });

//     /* Update user */
//     let user = await userModel.findOne({ _id: passwordReset.user });
//     user.password = req.body.password;

//     user
//       .save()
//       .then(async (savedUser) => {
//         await passwordResetModel.deleteOne({ _id: passwordReset._id });
//         res.status(200).send({
//           success: true,
//           message: "Password reset successfully",
//         });
//       })
//       .catch((error) => {
//         res.status(500).send({
//           success: false,
//           message: "Failed to reset password",
//           error,
//         });
//       });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in resetting password",
//       error,
//     });
//   }
// };

//forgotPasswordController
// export const forgotPasswordController = async (req, res) => {
//   try {
//     const { email, answer, newPassword } = req.body;
//     if (!email) {
//       res.status(400).send({ message: "Email is required" });
//     }
//     if (!answer) {
//       res.status(400).send({ message: "answer is required" });
//     }
//     if (!newPassword) {
//       res.status(400).send({ message: "New Password is required" });
//     }
//     //check
//     const user = await userModel.findOne({ email, answer });
//     //validation
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Wrong Email Or Answer",
//       });
//     }
//     const hashed = await hashPassword(newPassword);
//     await userModel.findByIdAndUpdate(user._id, { password: hashed });
//     res.status(200).send({
//       success: true,
//       message: "Password Reset Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//       error,
//     });
//   }
// };

//update profile
// export const updateProfileController = async (req, res) => {
//   try {
//     const { name, email, password, address, phone } = req.body;
//     const user = await userModel.findById(req.user._id);
//     //password
//     if (password && password.length < 6) {
//       return res.json({ error: "Passsword is required and 6 character long" });
//     }
//     const hashedPassword = password ? await hashPassword(password) : undefined;
//     const updatedUser = await userModel.findByIdAndUpdate(
//       req.user._id,
//       {
//         name: name || user.name,
//         password: hashedPassword || user.password,
//         phone: phone || user.phone,
//         address: address || user.address,
//       },
//       { new: true }
//     );
//     res.status(200).send({
//       success: true,
//       message: "Profile Updated SUccessfully",
//       updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({
//       success: false,
//       message: "Error WHile Update profile",
//       error,
//     });
//   }
// };
