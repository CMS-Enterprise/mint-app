const plan = {
  home: 'Home',
  teamRoles: {
    modelLead: 'Model Lead',
    leadership: 'Leadership',
    evaluation: 'Evaluation',
    learning: 'Learning',
    modelTeam: 'Model Team',
    itLead: 'IT Lead',
    oact: 'OACT',
    payment: 'Payment',
    quality: 'Quality'
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

export default plan;
