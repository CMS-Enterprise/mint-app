import {
  ASSESSMENT,
  ASSESSMENT_NONPROD,
  BASIC,
  BASIC_NONPROD,
  MAC,
  MINT_CONTRACTOR,
  MINT_CONTRACTOR_NONPROD
} from 'constants/jobCodes';
import { Flags } from 'types/flags';

export const isAssessment = (groups: Array<String> = [], flags: Flags) => {
  if (flags?.downgradeAssessmentTeam) {
    return false;
  }
  if (groups.includes(ASSESSMENT) || groups.includes(ASSESSMENT_NONPROD)) {
    return true;
  }

  return false;
};

export const isBasicUser = (groups: Array<String> = []) => {
  if (groups.includes(BASIC) || groups.includes(BASIC_NONPROD)) {
    return true;
  }

  return false;
};

export const isMAC = (groups: Array<String> = []) => {
  if (
    groups.includes(MAC) ||
    groups.includes(MINT_CONTRACTOR) ||
    groups.includes(MINT_CONTRACTOR_NONPROD)
  ) {
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
