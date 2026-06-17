/** A single waiver's yes/no selection and optional reason for not using it. */
export type WaiverSelectionFields = {
  willUseWaiver: boolean | null;
  notUsingReason: string;
};
