import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // const { avatar } = req.files;

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
      opt_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    await sendMail(
      email,
      "Verify your account",
      `Your OTP is ${otp},Please don't share it with anyone warna tumhari gaand bhi lag sakti hai!`
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

    if (user.otp !== otp || user.opt_expiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Otp is Invalid or It has been expired",
      });
    }

    user.verified = true;
    user.otp = null;
    user.opt_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Account Verified, You can now proceed further!");
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
