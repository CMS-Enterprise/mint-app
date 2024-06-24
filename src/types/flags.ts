export type Flags = {
  hideITLeadExperience: boolean;
  downgradeAssessmentTeam: boolean;
  hideGroupView: boolean;
  helpScoutEnabled: boolean;
  feedbackEnabled: boolean;
  notificationsEnabled: boolean;
  customHomepageEnabled: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
