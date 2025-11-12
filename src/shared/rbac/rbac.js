import opts from '#src/shared/rbac/policies/index.js';
import RBAC from 'easy-rbac';

const rbac = new RBAC(opts);

export default rbac;
