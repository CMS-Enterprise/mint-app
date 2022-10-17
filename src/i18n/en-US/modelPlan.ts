const modelPlan = {
  home: 'Home',
  teamRoles: {
    modelLead: 'Model Lead',
    leadership: 'Leadership',
    evaluation: 'Evaluation',
    learning: 'Learning',
    modelTeam: 'Model Team'
  },
  planStatuses: {
    planDraft: 'Draft model plan',
    planComplete: 'Model plan complete',
    icipComplete: 'ICIP complete',
    cmmiClearance: 'Internal (CMMI) clearance',
    cmsClearance: 'CMS clearance',
    hhsClearance: 'HHS clearance',
    ombASRFClearance: 'OMB/ASRF clearance',
    cleared: 'Cleared',
    announced: 'Announced'
  },
  status: {
    heading: 'Update status',
    copy:
      'After you’ve iterated on your Model Plan, update the status so others know what stage it’s at in the design and clearance process.',
    label: 'What is the status of your Model Plan?',
    updateButton: 'Update status',
    return: 'Don’t update status and return to task list'
  },
  favorite: {
    modelLead: 'Model lead(s)',
    startDate: 'Start date',
    cRTDLs: 'CRs and TDLs',
    toBeDetermined: 'To be determined',
    noneEntered: 'None entered',
    follow: 'Follow',
    following: 'Following'
  }
};

export default modelPlan;
