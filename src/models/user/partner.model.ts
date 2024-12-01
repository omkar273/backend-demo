import { model, Schema } from "mongoose";

const partnerSchema = new Schema({});

const Partner = model("Partner", partnerSchema);

export default Partner;