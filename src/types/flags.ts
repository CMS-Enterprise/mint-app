export type Flags = {
  hideITLeadExperience: boolean;
  downgradeAssessmentTeam: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
