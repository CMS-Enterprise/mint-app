const modelPlan = {
  home: 'Home',
  teamRoles: {
    modelLead: 'Model Lead',
    leadership: 'Leadership',
    evaluation: 'Evaluation',
    learning: 'Learning',
    modelTeam: 'Model Team',
    itLead: 'IT Lead',
    quality: 'Quality'
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
    announced: 'Announced',
    paused: 'Paused',
    canceled: 'Canceled'
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
    following: 'Following',
    success:
      'Success! You are no longer following {{-requestName}} and will not receive email notifications about this model.',
    failure:
      'There was an error unfollowing {{-requestName}}. Please try unfollowing the model again if you no longer wish to receive email notifications about it.',
    error: 'Failed to locate and unfollow model plan.'
  }
};

export default modelPlan;
