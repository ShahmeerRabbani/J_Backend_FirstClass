import mongoose from "mongoose";

const schema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
})

const UserModel = mongoose.model('User', schema)

export default UserModel;