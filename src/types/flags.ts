export type Flags = {
  hideITLeadExperience: boolean;
  downgradeAssessmentTeam: boolean;
  hideGroupView: boolean;
  helpScoutEnabled: boolean;
  changeHistoryReleaseDate: string;
  modelsApproachingClearanceEnabled: boolean;
  mintAnalyticsEnabled: boolean;
  sandbox: boolean;
  ctatEnabled: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
