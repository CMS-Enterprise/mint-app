const changeHistory = {
  heading: 'Change history',
  subheading: 'for {{modelName}}',
  back: 'Back to the task list',
  change:
    'made {{count}} change in {{section}} <datetime>on {{date}} at {{time}}</datetime>',
  change_other:
    'made {{count}} changes in {{section}} <datetime>on {{date}} at {{time}}</datetime>',
  sections: {
    model_plan: 'Model plan',
    plan_basics: 'Model basics',
    plan_general_characteristics: 'General characteristics',
    plan_participants_and_providers: 'Participants and providers',
    plan_beneficiaries: 'Beneficiaries',
    plan_ops_eval_and_learning: 'Operations, evaluation, and learning',
    plan_payments: 'Payments',
    plan_collaborator: 'Model team'
  },
  showDetails: 'Show details',
  hideDetails: 'Hide details',
  changeType: {
    ANSWERED: 'answered',
    REMOVED: 'removed',
    UPDATED: 'updated'
  },
  previousAnswer: 'Previous answer',
  recentChanges: 'Recent changes',
  viewChangeHistory: 'View change history'
};

export default changeHistory;
