// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: [true, "please add the email address"],
//       unique: [true, "email address already taken"],
//     },
//     password: {
//       type: String,
//       required: [true, "please add the password"],
//     },
//     role: {
//       type: String,
//       enum: ["seller", "customer"],
//       default: "customer",
//     },
//     products: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Products",
//       },
//     ],
//     orders: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Order",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     console.log("Plain password before hashing:", this.password);
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     console.log("Hashed password after hashing:", this.password);
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the password"],
    },
    role: {
      type: String,
      enum: ["seller", "customer"],
      default: "customer",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    console.log("Plain password before hashing:", this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed password after hashing:", this.password);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
