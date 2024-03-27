import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // const { avatar } = req.files;

    if (!email || !password || !name) {
      return res.status(200).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sdfsd",
        url: "sdfsdf",
      },
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    await sendMail(
      email,
      "Verify your account",
      `Your OTP is ${otp}, Please don't share it with anyone warna tumhari gaand bhi lag sakti hai!`
    );

    sendToken(
      res,
      user,
      200,
      "OTP sent to your email, Please verify your account"
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res, next) => {
  try {
    const otp = Number(req.body.otp);

    const user = await User.findById(req.user._id);

    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Otp is Invalid or It has been expired",
      });
    }

    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Account Verified, You can now proceed further!");
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendToken(res, user, 200, "Logged In Successfully");
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const user = await User.findById(req.user._id);

    user.tasks.push({
      title,
      description,
      completed: false,
      createdAt: new Date(Date.now()),
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Task added Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);

    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== taskId.toString()
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Task removed Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);

    const task = user.tasks.find(
      (task) => task._id.toString() === taskId.toString()
    );

    task.completed = !task.completed;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Task updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    sendToken(res, user, 200, `Welcome back, ${user.name}`);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const { name } = req.body;
    // const { avatar } = req.files;

    // if(avatar)

    if (name) {
      user.name = name;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Fill all Feilds",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid password",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;
    user.reset_password_otp_expiry = new Date(
      Date.now() + process.env.OTP_EXPIRE * 60 * 1000
    );
    await user.save();

    await sendMail(
      email,
      "Reset Password OTP",
      `Your OTP for reseting the password is ${otp}, If you did not request for this, please Ignore this!`
    );

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const otp = Number(req.body.otp);
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      reset_password_otp_expiry: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Otp is Invalid or has been expired",
      });
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.reset_password_otp_expiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Password resetted Successfully, You can now login!`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
