import ApiError from "../api_error.js";

interface Props {
    role: string;
    data: any;
}

export const validRoles = ['customer', 'user', 'admin', 'superadmin', 'vendor', 'partner'];

export const handleRoleSpecificFields = ({ data, role }: Props): string[] => {
    if (!validRoles.includes(role)) {
        throw new ApiError(`Invalid role: ${role}`);
    }
    const missingFields: string[] = [];

    switch (role) {
        case 'customer':
            break;
        case 'vendor':
            if (!data.businessName) {
                console.log("Missing field: 'businessName'");
                // Handle the missing 'businessName' field
            }
            if (!data.phone) {
                console.log("Missing field: 'phone'");
                // Handle the missing 'phone' field
            }
            break;

        case 'admin':

            if (!data.permissions) {
                console.log("Missing field: 'permissions'");
                // Handle the missing 'permissions' field
            }
            break;

        case 'superadmin':
            // Superadmin might have additional checks
            if (!data.superpower) {
                console.log("Missing field: 'superpower'");
                // Handle the missing 'superpower' field
            }
            break;

        case 'partner':
            if (!data.partnerDetails) {
                console.log("Missing field: 'partnerDetails'");
                // Handle the missing 'partnerDetails' field
            }
            break;

        default:
            console.log("Unknown role");
            break;
    }

    return missingFields;
}
