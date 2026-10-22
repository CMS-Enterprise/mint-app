import { GetWaiversQuery } from 'gql/generated/graphql';

/** A single waiver's yes/no selection and the optional reason for that decision. */
export type WaiverSelectionFields = {
  willUseWaiver: boolean | null;
  notUsingReason: string;
  usingReason: string;
};

/** Form state for page 6 waiver selection, keyed by common waiver ID. */
export type WaiverSelectionForm = {
  waivers: Record<string, WaiverSelectionFields>;
  isEmptyWaiversConfirmed: boolean | null;
};

/** A model plan waiver row from the GetWaivers query. */
export type ExistingWaiver =
  GetWaiversQuery['modelPlan']['waiverInfo']['commonWaivers'][number];
