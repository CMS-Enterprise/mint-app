import { ASSESSMENT, BASIC, MAC } from 'constants/jobCodes';
import { Flags } from 'types/flags';

export const isAssessment = (groups: Array<String> = [], flags?: Flags) => {
  if (groups.includes(ASSESSMENT)) {
    return true;
  }

  return false;
};

export const isBasicUser = (groups: Array<String> = [], flags?: Flags) => {
  if (groups.includes(BASIC)) {
    return true;
  }

  return false;
};

export const isMAC = (groups: Array<String> = [], flags?: Flags) => {
  if (groups.includes(MAC)) {
    return true;
  }

  return false;
};

const user = {
  isAssessment,
  isBasicUser,
  isMAC
};

export default user;
