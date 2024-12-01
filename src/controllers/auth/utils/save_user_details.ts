
import { RoleData } from '../../../models/user/roles_data.model.js';
import { UserRole } from '../../../models/user/user.model.js';
import { Customer } from '../../../models/user/customer.model.js';
import Vendor from '../../../models/user/vendor.model.js';
import Admin from '../../../utils/admin.model.js';
import Partner from '../../../models/user/partner.model.js';
import SuperAdmin from '../../../models/user/super_admin.model.js';
import ApiError from '../../../utils/api_error.js';

interface Props {
    role: string;
    verifyToken: string;
    verifyTokenExpiry: Date;
    data: any,
}

const saveUserDetails = async ({ data, role, verifyToken, verifyTokenExpiry }: Props) => {

    const rolesData = new RoleData({
        role,
        verifyToken,
        verifyTokenExpiry,
    })

    let doc_id = '';

    switch (role) {
        case UserRole.CUSTOMER:
            const customer = await Customer.create(data);
            doc_id = customer._id as string;
            break;

        case UserRole.VENDOR:
            const vendor = await Vendor.create(data);
            doc_id = vendor._id as string;
            break;

        case UserRole.ADMIN:
            const admin = await Admin.create(data);
            doc_id = admin._id as string;
            break;
        case UserRole.PARTNER:
            const partner = await Partner.create(data);
            doc_id = partner._id as string;
            break;
        case UserRole.SUPERADMIN:
            const superadmin = await SuperAdmin.create(data);
            doc_id = superadmin._id as string;
            break;

        default:
            break;
    }

    if (doc_id.length == 0) {
        throw new ApiError('Error saving user details', 500);
    }

    rolesData.doc_id = doc_id;
    await rolesData.save();
}

export default saveUserDetails;