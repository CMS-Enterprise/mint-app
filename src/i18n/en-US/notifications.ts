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
      ADDED_AS_COLLABORATOR: {
        text: ' added you to the team for {{modelName}}.',
        cta: 'Start collaborating'
      },
      DAILY_DIGEST_COMPLETE: {
        text: ' sent your daily digest.',
        cta: {
          view: 'View digest',
          hide: 'Hide digest'
        }
      },
      DATES_CHANGED: {
        text: ' updated the dates for {{modelName}}.',
        cta: {
          view: 'View changes',
          hide: 'Hide changes'
        }
      },
      INCORRECT_MODEL_STATUS: {
        text: ' suggests that you update the model status for {{modelName}}.',
        cta: {
          view: 'View suggested status',
          hide: 'Hide suggested status'
        }
      },
      MODEL_PLAN_SHARED: {
        text: ' shared {{-modelName}} with you.',
        cta: 'View Model Plan'
      },
      NEW_DISCUSSION_REPLY: {
        text: ' replied to your discussion for {{-modelName}}.',
        cta: 'View discussion'
      },
      TAGGED_IN_DISCUSSION: {
        text: ' tagged you in a discussion for {{-modelName}}.',
        cta: 'View discussion'
      },
      TAGGED_IN_DISCUSSION_REPLY: {
        text: ' tagged you in a discussion reply for {{-modelName}}.',
        cta: 'View discussion'
      },
      NEW_MODEL_PLAN: {
        text: ' created a Model Plan: {{-modelName}}.',
        cta: 'View Model Plan'
      },
      DATA_EXCHANGE_APPROACH_MARKED_COMPLETE: {
        text: ' marked the data exchange approach complete for {{-modelName}}.',
        cta: 'View data exchange approach'
      }
    },
    dailyDigest: {
      heading: 'Your daily updates',
      cta: 'View all recent changes',
      unsubscribe:
        'To stop receiving notifications for a specific model, unfollow the model at the top of the Model Plan page.',
      nameChange: 'This model has been renamed (previously {{-oldName}})',
      addModelLead: '{{-name}} has been added as a model lead',
      documentsAdded: '{{-number}} new documents have been uploaded',
      crTdlsUpdate: 'Updates to FFS CRs/TDLs',
      discussionActivity: 'New activity in Discussions',
      dataExchangeApproachComplete: 'Data exchange approach is complete',
      readyForReview: '{{-taskSection}} is ready for review ',
      readyForClearance: '{{-taskSection}}  is ready for clearance',
      updatesTo: 'Updates to {{-taskSection}}',
      planSections: {
        plan_payments: 'Payments',
        plan_ops_eval_and_learning: 'Operations, evaluation, and learning',
        plan_participants_and_providers: 'Participants and providers',
        plan_beneficiaries: 'Beneficiaries',
        plan_general_characteristics: 'General characteristics',
        plan_basics: 'Model Basics',
        plan_data_exchange_approach: 'Data exchange approach',
        plan_timeline: 'Model timeline',
        mto_category: 'Model-to-operations matrix (MTO)',
        mto_common_milestones: 'Model-to-operations matrix (MTO)',
        mto_common_solutions: 'Model-to-operations matrix (MTO)',
        mto_milestone: 'Model-to-operations matrix (MTO)',
        mto_milestone_solution_links: 'Model-to-operations matrix (MTO)',
        mto_info: 'Model-to-operations matrix (MTO)',
        mto_solution: 'Model-to-operations matrix (MTO)'
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
    },
    datesChanged: {
      heading: 'Dates have been updated for {{-modelName}}',
      subheading: 'One or more dates have been updated for this model.',
      cta: 'View this Model Plan',
      noDateEntered: 'no date entered',
      field: {
        ANNOUNCED: 'Announce model',
        APPLICATIONS: 'Application period',
        CLEARANCE: 'Clearance',
        COMPLETE_ICIP: 'Complete ICIP',
        PERFORMANCE_PERIOD: 'Performance period',
        WRAP_UP_ENDS: 'Model wrap-up end date'
      }
    },
    incorrectModelStatus: {
      heading: "It's time to update the model status for {{-modelName}}",
      currentStatus: '<bold>Current status:</bold> {{-currentStatus}}',
      newStatus: '<bold>New status:</bold> {{-newStatus}}',
      cta: 'Yes, update my model’s status',
      adjustTimeline:
        'If you’re not ready to update your model’s status, please <link1>adjust your model’s anticipated timeline.</link1>'
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
      },
      notificationAboutMyModels: {
        heading: 'Notifications about my models',
        subHeading:
          'Regardless of your settings here, you will receive both email and in-app notifications for all models where you are listed as the Model Lead.',
        info: 'You are listed as the Model Lead for {{count}} models.'
      },
      additionalNotifications: {
        heading: 'Additional notifications'
      }
    },
    configurations: {
      dailyDigestComplete:
        'Daily digest of changes to the models I’m following',
      addedAsCollaborator: 'When I’m added as a collaborator to a Model Plan',
      taggedInDiscussion: 'When I’m tagged in a discussion',
      newDiscussionReply: 'When someone replies to a discussion I started',
      modelPlanShared: 'When someone shares a Model Plan with me',
      incorrectModelStatus: 'When MINT detects an incorrect model status',
      newModelPlan: 'When a new Model Plan is created',
      datesChanged: 'When model dates change',
      dataExchangeApproachMarkedComplete:
        'When a data exchange approach is completed'
    },
    additionalConfigurations: {
      whichModel: 'Which models?',
      whichModelTypes: {
        ALL_MODELS: 'All models',
        FOLLOWED_MODELS: 'Models I’m following',
        MY_MODELS: 'My Model Plans'
      }
    },
    save: 'Save',
    dontUpdate: 'Don’t update and return to previous page',
    successMessage: 'Success! Your notification settings have been updated.',
    errorMessage:
      'An error occurred while saving your notification settings. Please try again.',
    unsubscribedMessage: {
      success:
        'You have successfully unsubscribed from email notifications <bold>{{-notificationType}}.</bold>',
      error:
        'There was an error unsubscribing. Please try again. If the error persists, try again at a later date.',
      alreadyUnsubscribed:
        'You are already unsubscribed from email notifications <bold>{{-notificationType}}.</bold>',
      activityType: {
        NEW_MODEL_PLAN: 'when a new Model Plan is created',
        DATES_CHANGED: 'when model dates change',
        DATA_EXCHANGE_APPROACH_MARKED_COMPLETE:
          'when a data exchange approach is completed'
      }
    }
  }
};

export default notifications;
