import { model, Schema } from "mongoose";



const superAdminSchema = new Schema({})

const SuperAdmin = model("SuperAdmin", superAdminSchema);

export default SuperAdmin;