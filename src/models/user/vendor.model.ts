import { Schema, Document, model } from 'mongoose';

export interface IVendor extends Document {
    _id: string;
    shop_name: string;
    address: string;
    logo?: string;
    description: string;
    website?: string;
    gst_no?: string;
    google_map_url?: string;
    socialMediaLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
}


const vendorSchema = new Schema<IVendor>({
    shop_name: {
        type: String,
        required: [true, 'Shop name is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    logo: {
        type: String,
    },
    description: {
        type: String,
        default: '',
    },
    website: {
        type: String,
    },
    gst_no: {
        type: String,
    },
    google_map_url: {
        type: String,
    },
    socialMediaLinks: {
        facebook: {
            type: String,
        },
        twitter: {
            type: String,
        },
        instagram: {
            type: String,
        },
        linkedin: {
            type: String,
        },
    },
},
    { timestamps: true });

const Vendor = model<IVendor>('Vendor', vendorSchema);

export default Vendor;
