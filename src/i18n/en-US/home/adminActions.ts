const adminActions = {
  title: 'Admin actions',
  actions: [
    {
      header: 'Manage common milestones',
      description:
        'Add, edit, and remove milestones from the common milestone library. This will apply to all MINT users and will affect the common milestones that model teams and IT Leads have access to when completing their MTO.',
      cta: 'View common milestones',
      route: '/help-and-knowledge/milestone-library'
    },
    {
      header: 'Manage SME contact directory',
      description:
        'Add, edit, and remove subject matter experts (SMEs) from the contact directory in MINT’s Help and Knowledge Center.',
      cta: 'View SME contact directory',
      route: '/help-and-knowledge#contact-directory',
      scrollTo: 'contact-directory'
    }
  ]
};

export default adminActions;
