const notifications = {
  breadcrumb: 'Notifications',
  index: {
    heading: 'Notifications',
    markAllAsRead: 'Mark all ({{-number}}) as read',
    notificationSettings: 'Notification settings',
    infoBanner: {
      emptyState:
        'You’re all up-to-date on notifications. Check back later for updates.'
    },
    activityType: {
      addedAsCollaborator: {
        text: ' added you to the team for {{-modelName}}.',
        cta: 'Start collaborating'
      },
      dailyDigestComplete: {
        text: ' sent your daily digest.',
        cta: {
          show: 'View digest',
          hide: 'Hide digest'
        }
      },
      modelPlanShared: {
        text: ' shared {{-modelName}} with you.',
        cta: 'View Model Plan'
      },
      newDiscussionReply: {
        text: ' replied to your discussion for {{-modelName}}.',
        cta: 'View discussion'
      },
      taggedInDiscussion: {
        text: ' tagged you in a discussion for {{-modelName}}.',
        cta: 'View discussion'
      },
      taggedInDiscussionReply: {
        text: ' tagged you in a discussion reply for {{-modelName}}.',
        cta: 'View discussion'
      }
    },
    dailyDigest: {
      heading: 'Your daily updates',
      cta: 'View this Model Plan',
      unsubscribe:
        'To stop receiving notifications for a specific model, unfollow the model at the top of the Model Plan page.',
      nameChange: 'This model has been renamed (previously {{-oldName}})',
      addModelLead: '{{-name}} has been added as a model lead',
      documentsAdded: '{{-number}} new documents have been uploaded',
      crTdlsUpdate: 'Updates to FFS CRs/TDLs',
      discussionActivity: 'New activity in Discussions',
      readyForReview: '{{-taskSection}} is ready for review ',
      readyForClearance: '{{-taskSection}}  is ready for clearance',
      updatesTo: 'Updates to {{-taskSection}}',
      planSections: {
        plan_payments: 'Payments',
        plan_ops_eval_and_learning: 'Operations, evaluation, and learning',
        plan_participants_and_providers: 'Participants and providers',
        plan_beneficiaries: 'Beneficiaries',
        plan_general_characteristics: 'General characteristics',
        plan_basics: 'Basics'
      },
      statusChange: {
        PLAN_DRAFT: 'This model has been announced',
        PLAN_COMPLETE: 'This Model Plan is complete',
        ICIP_COMPLETE: 'The ICIP for this model is complete',
        INTERNAL_CMMI_CLEARANCE: 'This model is in internal (CMMI) clearance',
        CMS_CLEARANCE: 'This model is in CMS clearance',
        HHS_CLEARANCE: 'This model is in HHS clearance',
        OMB_ASRF_CLEARANCE: 'This model is in OMB/ASRF clearance',
        CLEARED: 'This model has been cleared',
        ANNOUNCED: 'This model has been announced'
      },
      moreChanges: '+{{-num}} more changes'
    }
  },
  settings: {
    heading: 'Notification settings',
    subHeading:
      'Choose whether you would like to receive notifications via email, in the MINT application, or both.',
    notification: 'Notification',
    email: 'Email',
    inApp: 'In-app',
    sections: {
      basicNotifications: {
        heading: 'Basic notifications',
        subHeading:
          'You will always receive basic notifications in-app, but may opt out of receiving them via email.'
        // configurations: {
        //   dailyDigestComplete:
        //     'Daily digest of changes to the models I’m following',
        //   addedAsCollaborator:
        //     'When I’m added as a collaborator to a Model Plan',
        //   taggedInDiscussion: 'When I’m tagged in a discussion',
        //   newDiscussionReply: 'When someone replies to a discussion I started',
        //   modelPlanShared: 'When someone shares a Model Plan with me'
        // }
      },
      additionalNotifications: {
        heading: 'Additional notifications'
        // configurations: {
        //   modelCreation: 'When a new Model Plan is created',
        //   dateChanges: 'When a model dates change',
        //   whichModel: 'Which model'
        // }
      }
    },
    configurations: {
      dailyDigestComplete:
        'Daily digest of changes to the models I’m following',
      addedAsCollaborator: 'When I’m added as a collaborator to a Model Plan',
      taggedInDiscussion: 'When I’m tagged in a discussion',
      newDiscussionReply: 'When someone replies to a discussion I started',
      modelPlanShared: 'When someone shares a Model Plan with me'
    },
    additionalConfigurations: {
      modelCreation: 'When a new Model Plan is created',
      dateChanges: 'When model dates change',
      whichModel: 'Which models?',
      whichModelTypes: {
        all: 'All models',
        following: 'Models I’m following',
        mine: 'My Model Plans'
      }
    },
    save: 'Save',
    dontUpdate: 'Don’t update and return to previous page',
    success: 'Success! Your notification settings have been updated.',
    error:
      'An error occurred while saving your notification settings. Please try again.'
  }
};

export default notifications;
