import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please add the email address"],
      unique: [true, "email address already taken"],
    },
    password: {
      type: String,
      required: [true, "please add the password"],
    },
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
