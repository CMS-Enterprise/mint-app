import { TranslationOperationalNeeds } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const operationalNeeds: TranslationOperationalNeeds = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Operational need',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT
  },
  nameOther: {
    gqlField: 'nameOther',
    goField: 'NameOther',
    dbField: 'name_other',
    label: 'What operational need are you solving?',
    readonlyLabel: 'Operational need',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT
  },
  key: {
    gqlField: 'key',
    goField: 'Key',
    dbField: 'key',
    label: '',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      MANAGE_CD: 'Manage Part C/D enrollment',
      REV_COL_BIDS: 'Review and collect plan bids',
      UPDATE_CONTRACT: 'Update the plan’s contract',
      RECRUIT_PARTICIPANTS: 'Recruit participants',
      REV_SCORE_APP: 'Review and score applications',
      APP_SUPPORT_CON: 'Obtain an application support contractor',
      COMM_W_PART: 'Communicate with participants',
      MANAGE_PROV_OVERLAP: 'Manage provider overlaps',
      MANAGE_BEN_OVERLAP: 'Manage beneficiary overlaps',
      HELPDESK_SUPPORT: 'Helpdesk support',
      IDDOC_SUPPORT: 'IDDOC support',
      ESTABLISH_BENCH: 'Establish a benchmark with participants',
      PROCESS_PART_APPEALS: 'Process participant appeals',
      ACQUIRE_AN_EVAL_CONT: 'Acquire an evaluation contractor',
      DATA_TO_MONITOR: 'Data to monitor the model',
      DATA_TO_SUPPORT_EVAL: 'Data to support model evaluation',
      CLAIMS_BASED_MEASURES: 'Claims-based measures',
      QUALITY_PERFORMANCE_SCORES: 'Quality performance scores',
      SEND_REPDATA_TO_PART: 'Send reports/data to participants',
      ACQUIRE_A_LEARN_CONT: 'Acquire a learning contractor',
      PART_TO_PART_COLLAB: 'Participant-to-participant collaboration',
      EDUCATE_BENEF: 'Educate beneficiaries',
      ADJUST_FFS_CLAIMS: 'Adjust how FFS claims are paid',
      MANAGE_FFS_EXCL_PAYMENTS: 'Manage FFS excluded payments',
      MAKE_NON_CLAIMS_BASED_PAYMENTS: 'Make non-claims based payments',
      COMPUTE_SHARED_SAVINGS_PAYMENT: 'Compute shared savings payment',
      RECOVER_PAYMENTS: 'Recover payments',
      SIGN_PARTICIPATION_AGREEMENTS: 'Sign Participation Agreements',
      VET_PROVIDERS_FOR_PROGRAM_INTEGRITY:
        'Vet providers for program integrity',
      UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR:
        'Utilize quality measures development contractor',
      IT_PLATFORM_FOR_LEARNING: 'IT platform for learning'
    }
  },
  needed: {
    gqlField: 'needed',
    goField: 'Needed',
    dbField: 'needed',
    label: '',
    readonlyLabel: 'Operational deed',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    options: {
      true: 'Needed',
      false: 'Not needed'
    }
  }
};

export const operationalNeedsMisc: Record<string, string> = {
  heading: 'Model name',
  modelID: 'Model ID',
  createdBy: 'Created by',
  createdAt: 'Created at',
  readyForReviewBy: 'Ready for review by',
  readyForReviewAt: 'Ready for review at',
  breadcrumb: 'Start a new Model Plan',
  modeName: 'What is the name of your model?',
  modelNameInfo:
    'This is not a permanent name. If needed, you may update it later.',
  headingStatus: 'Update status',
  copy:
    'After you’ve iterated on your Model Plan, update the status so others know what stage it’s at in the design and clearance process.',
  updateButton: 'Update status',
  return: 'Don’t update status and return to task list'
};

export default operationalNeeds;
