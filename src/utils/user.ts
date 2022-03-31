import { ADMIN_DEV, ADMIN_PROD, BASIC_PROD } from 'constants/jobCodes';
import { Flags } from 'types/flags';

export const isAdmin = (groups: Array<String> = [], flags: Flags) => {
  if (groups.includes(ADMIN_DEV) || groups.includes(ADMIN_PROD)) {
    return true;
  }

  return false;
};

export const isBasicUser = (groups: Array<String> = [], flags: Flags) => {
  if (groups.includes(BASIC_PROD)) {
    return true;
  }
  if (groups.length === 0) {
    return true;
  }
  if (!isAdmin(groups, flags)) {
    return true;
  }
  return false;
};

const user = {
  isAdmin,
  isBasicUser
};

export default user;
