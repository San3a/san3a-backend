import roles from '#src/shared/rbac/enum/roles.js';
import adminPolicy from '#src/shared/rbac/policies/admin-policy.js';
import technicianPolicy from '#src/shared/rbac/policies/technician-policy.js';
import userPolicy from '#src/shared/rbac/policies/user-policy.js';

const opts = {
    [roles.ADMIN]: { can: adminPolicy },
    [roles.USER]: { can: userPolicy },
    [roles.TECHNICIAN]: { can: technicianPolicy },
};

export default opts;
