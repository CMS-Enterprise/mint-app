const changeHistory = {
  heading: 'Change history',
  subheading: 'for {{modelName}}',
  back: 'Back to the task list',
  backToReadView: 'Back to the Read view',
  change:
    'made {{count}} change in {{section}} <datetime>on {{date}} at {{time}}</datetime>',
  change_other:
    'made {{count}} changes in {{section}} <datetime>on {{date}} at {{time}}</datetime>',
  planCreate:
    'created {{plan_name}} <datetime>on {{date}} at {{time}}</datetime>',
  taskStatusUpdate:
    'marked {{section}} as {{status}} <datetime>on {{date}} at {{time}}</datetime>',
  teamANSWERED:
    '{{action}} {{collaborator}} as {{role}} to the model team <datetime>on {{date}} at {{time}}</datetime>',
  teamUPDATED:
    '{{action}} {{collaborator}}’s role to {{role}} <datetime>on {{date}} at {{time}}</datetime>',
  teamREMOVED:
    '{{action}} {{collaborator}} from the model team <datetime>on {{date}} at {{time}}</datetime>',
  plan_discussionAnswered:
    'started a Discussion <datetime>on {{date}} at {{time}}</datetime>',
  discussion_replyAnswered:
    'replied to a Discussion <datetime>on {{date}} at {{time}}</datetime>',
  documentUpdate:
    '<bold>{{documentName}}</bold> {{isLink}} {{action}} {{toFrom}} Documents',
  crTdlUpdate:
    '{{action}} {{crTdlName}} {{toFrom}} FFS CRs and TDLs <datetime>on {{date}} at {{time}}</datetime>',
  documentSolutionLinkUpdate:
    '{{documentName}} {{action}} <normal>{{toFrom}}</normal> {{solutionName}}',
  solutionCreate:
    'addded {{-count}} solutions to {{needName}} in Operational solutions and implementation status tracker <datetime>on {{date}} at {{time}}</datetime>',
  solutionUpdate: '{{needName}} solution {{action}}: {{solutionName}}',
  subtaskUpdate:
    'Subtask {{action}} {{forFrom}} {{needName}}: {{solutionName}}',
  needUpdate:
    '{{action}} a custom operation need in Operational solutions and implementation status tracker <datetime>on {{date}} at {{time}}</datetime>',
  sections: {
    model_plan: 'Model plan',
    plan_basics: 'Model basics',
    plan_general_characteristics: 'General characteristics',
    plan_participants_and_providers: 'Participants and providers',
    plan_beneficiaries: 'Beneficiaries',
    plan_ops_eval_and_learning: 'Operations, evaluation, and learning',
    plan_payments: 'Payments',
    plan_collaborator: 'Model team',
    plan_discussion: 'Discussions',
    discussion_reply: 'Discussions',
    plan_document: 'Documents',
    plan_cr: 'FFS CRs and TDLs',
    plan_tdl: 'FFS CRs and TDLs',
    operational_need: 'Operational solutions and implementation status tracker',
    operational_solution:
      'Operational solutions and implementation status tracker',
    operational_solution_subtask:
      'Operational solutions and implementation status tracker',
    plan_document_solution_link:
      'Operational solutions and implementation status tracker'
  },
  showDetails: 'Show details',
  hideDetails: 'Hide details',
  resultsInfo: 'Showing {{resultsNum}} of {{count}} result {{query}}',
  resultsInfo_other:
    'Showing {{resultsNum}} - {{count}} of {{total}} results {{query}}',
  resultsNoInfo: 'Showing {{resultsNum}} result {{query}}',
  resultsNoInfo_other: 'Showing {{resultsNum}} results {{query}}',
  noResults: {
    heading: 'There are no results that match you search.',
    body: 'Please double-check you search and try again.'
  },
  auditUpdateType: {
    INSERT: 'added',
    DELETE: 'removed',
    UPDATE: 'updated'
  },
  documentChangeType: {
    uploaded: 'uploaded',
    removed: 'removed',
    added: 'added'
  },
  documentLinkType: {
    INSERT: 'connected',
    DELETE: 'removed'
  },
  teamChangeType: {
    ANSWERED: 'added',
    REMOVED: 'removed',
    UPDATED: 'updated'
  },
  changeType: {
    CREATED: 'created',
    ANSWERED: 'answered',
    REMOVED: 'removed',
    UPDATED: 'updated'
  },
  toFromIn: {
    INSERT: 'to',
    DELETE: 'from',
    UPDATE: 'in'
  },
  toFrom: {
    INSERT: 'to',
    DELETE: 'from',
    UPDATE: 'to'
  },
  forFrom: {
    DELETE: 'from',
    UPDATE: 'for',
    INSERT: 'for'
  },
  sort: {
    label: 'Sort',
    newest: 'Newest changes',
    oldest: 'Oldest changes'
  },
  previousAnswer: 'Previous answer',
  previousNote: 'Previous note',
  previousDetails: 'Previous details',
  notApplicable:
    'Because of this change, the following question(s) are no longer applicable:',
  recentChanges: 'Recent changes',
  viewChangeHistory: 'View change history',
  noChanges:
    'There are no changes to show at this time. When a change is made to this Model Plan, it will appear here.',
  changesSinceRelease:
    'This Model Plan was created before the release of Change history. Because of this, you can only view changes made since [Release date].',
  followUp: 'Follow-up to ',
  noteFor: 'Note for '
};

export default changeHistory;
