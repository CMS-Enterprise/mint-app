export type Flags = {
  hideITLeadExperience: boolean;
  downgradeAssessmentTeam: boolean;
  hideGroupView: boolean;
  helpScoutEnabled: boolean;
  feedbackEnabled: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
