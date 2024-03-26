import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: [8, "Password must have atleast 8 characters"],
    required: true,
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [
    {
      title: String,
      description: String,
      completed: Boolean,
      createdAt: Date,
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  otp: Number,
  opt_expiry: Date,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  schema.index({ opt_expiry: 1 }, { expireAfterSeconds: 0 });

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

export const User = mongoose.model("User", schema);
