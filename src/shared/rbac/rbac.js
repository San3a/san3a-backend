import RBAC from 'easy-rbac';
import opts from './policies/index.js';

const rbac = new RBAC(opts);

export default rbac;
