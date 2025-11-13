import opts from '#src/shared/rbac/policies/index.js';
import RBAC from 'easy-rbac';
import opts from './policies/index.js';

const rbac = new RBAC(opts);

export default rbac;
