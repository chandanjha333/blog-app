import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import { createTokenForUser } from "../services/auth.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    }, 
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: '/user-profile-avatar-free-vector.jpg',
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    }
  }, 
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if(!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.static(
  'matchPasswordAndGenerateToken', 
  async function(email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found!');

    const match = await bcrypt.compare(password, user.password);
    
    if(match) {
      const token = createTokenForUser(user);
      return token;
    } 
    else throw new Error('Incorrect Password');
  }
);

export const User = model('user', userSchema);