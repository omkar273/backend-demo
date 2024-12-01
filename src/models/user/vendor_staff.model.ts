import { model, Schema } from "mongoose";


const  vendorStaffSchema = new Schema({})

const VendorStaff = model("VendorStaff", vendorStaffSchema);
export default VendorStaff;