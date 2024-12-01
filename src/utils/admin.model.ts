import { model, Schema } from "mongoose";


const adminSchema = new Schema({});

const Admin = model("Admin", adminSchema);
export default Admin;