import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    name:{type : String, require: true},
    email:{type : String, require: true, unique:true},
    // password is not required for accounts created via Google Sign-In
    password:{type : String, require: false},
    // set for users who sign up / log in with Google; used to avoid duplicate accounts for the same Google identity
    googleId:{type : String, unique:true, sparse:true},
    authProvider:{type : String, enum:['local', 'google'], default:'local'},
    resetToken: {type : String, },
  resetTokenExpire:{type : Date }
},
{timestamps:true})

UserSchema.methods.comparePassword = function(password){
    // Google-only accounts have no password set, so there is nothing to compare
    if (!this.password) return false;
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model("User", UserSchema);

export default User;