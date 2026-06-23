import { GetWaiversQuery } from 'gql/generated/graphql';

/** A single waiver's yes/no selection and optional reason for not using it. */
export type WaiverSelectionFields = {
  willUseWaiver: boolean | null;
  notUsingReason: string;
};

/** Form state for page 6 waiver selection, keyed by common waiver ID. */
export type WaiverSelectionForm = {
  waivers: Record<string, WaiverSelectionFields>;
};

/** A model plan waiver row from the GetWaivers query. */
export type ExistingWaiver =
  GetWaiversQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey']['waivers'][number];
