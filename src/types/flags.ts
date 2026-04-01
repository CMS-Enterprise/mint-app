export type Flags = {
  hideITLeadExperience: boolean;
  downgradeAssessmentTeam: boolean;
  hideGroupView: boolean;
  helpScoutEnabled: boolean;
  changeHistoryReleaseDate: string;
  modelsApproachingClearanceEnabled: boolean;
  mintAnalyticsEnabled: boolean;
  sandbox: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
