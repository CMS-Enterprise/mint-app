export type Flags = {
  hideITLeadExperience: boolean;
  downgradeAssessmentTeam: boolean;
  hideGroupView: boolean;
  helpScoutEnabled: boolean;
  feedbackEnabled: boolean;
  notificationsEnabled: boolean;
  changeHistoryEnabled: boolean;
  changeHistoryReleaseDate: string;
  modelsApproachingClearanceEnabled: boolean;
  echimpEnabled: boolean; // TODO Clean up / remove in https://jiraent.cms.gov/browse/MINT-3134
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
