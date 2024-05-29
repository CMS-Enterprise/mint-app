import { TranslationDiscussions } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const discussions: TranslationDiscussions = {
  userRole: {
    gqlField: 'userRole',
    goField: 'UserRole',
    dbField: 'user_role',
    label: 'Your role',
    sublabel: 'This will display with your name to help others identify you.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: {
      CMS_SYSTEM_SERVICE_TEAM: 'CMS System/Service Team',
      IT_ARCHITECT: 'IT Architect',
      LEADERSHIP: 'Leadership',
      MEDICARE_ADMINISTRATIVE_CONTRACTOR: 'Medicare Administrative Contractor',
      MINT_TEAM: 'MINT Team',
      MODEL_IT_LEAD: 'Model IT Lead',
      MODEL_TEAM: 'Model Team',
      SHARED_SYSTEM_MAINTAINER: 'Shared System Maintainer',
      NONE_OF_THE_ABOVE: 'None of the above'
    }
  },
  userRoleDescription: {
    gqlField: 'userRoleDescription',
    goField: 'UserRoleDescription',
    dbField: 'user_role_description',
    label: 'Enter a short description for your role',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT
  },
  content: {
    gqlField: 'content',
    goField: 'content',
    dbField: 'content',
    label: 'Type your question or discussion topic',
    sublabel:
      'To tag a solution team or individual, type "@" and begin typing the name. Then, select the team or individual from the list you wish to notify.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA
  },
  isAssessment: {
    gqlField: 'isAssessment',
    goField: 'IsAssessment',
    dbField: 'is_assessment',
    label: 'Is the user an assessment user?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.BOOLEAN,
    options: {
      true: 'Yes',
      false: 'No'
    }
  }
};

type NestedTranslation = Record<string, string>;

export const discussionsMisc: Record<string, string | NestedTranslation> = {
  heading: 'Discussions',
  modalHeading: 'Model discussions',
  discussionBanner: {
    discussion: ' discussion',
    discussion_other: ' discussions'
  },
  discussionPanelHeading: 'Start a discussion',
  discussionPanelReply: 'Discussion',
  description:
    'Need help with something? Start a discussion and you’ll be notified of any replies. If you need help on a specific question or field, please include the name of the question or field and the section it’s located in.',
  allFieldsRequired: 'All fields marked with <s>*</s> are required.',
  noDiscussions: 'There are no discussions yet. ',
  askAQuestionLink: 'Start a discussion',
  reply: 'Reply',
  replies: '{{count}} reply',
  replies_other: '{{count}} replies',
  replies_0: 'No replies',
  typeReply: 'Type your reply',
  save: 'Save discussion',
  saveReply: 'Save reply',
  lastReply: 'Last reply {{date}} at {{time}}',
  useLinkAbove:
    'There are no new discussion topics. Start a discussion and it will appear here.',
  newDiscussionTopics: '{{count}} new discussion topic',
  newDiscussionTopics_other: '{{count}} new discussion topics',
  discussionWithCount: '{{count}} discussion',
  discussionWithCount_other: '{{count}} discussions',
  answered: 'answered question',
  viewDiscussions: 'View discussions',
  success: 'Success! Your discussion topic has been added.',
  successReply: 'Success! Your reply has been added.',
  errorFetch:
    'Sorry we encountered a problem fetching your discusssions.  Please try again.',
  error:
    'Sorry, we encountered a problem adding your discussion topic. Please try again.',
  errorReply:
    'Sorry, we encountered a problem adding your reply. Please try again.',
  answerDescription:
    'Make sure you know the answer to this question before replying. Once a question has been answered, it cannot be replied to again.',
  ago: 'ago',
  justNow: 'Just now',
  noAnswered:
    'There are no discussions with replies yet. Once a discussion has been replied to, it will appear here.',
  noUanswered:
    'There are no new discussion topics. Start a discussion and it will appear here.',
  nonEditor: {
    noDiscussions:
      'There are no discussions with replies yet. When a question is asked, it will appear here.',
    noQuestions:
      'There are no new discussion topics. When a question is asked, it will appear here.'
  },
  ariaLabel: 'Discussion Center Modal',
  assessment: 'MINT Team',
  viewMoreQuestions: 'View more questions',
  viewFewerQuestions: 'View fewer questions',
  viewMoreReplies: 'View more replies',
  viewFewerReplies: 'View fewer replies',
  alreadyAnswered:
    '“{{-question}}” has already been answered. You can view it in the answered questions below.',
  select: 'Select',
  userRole: {
    CMS_SYSTEM_SERVICE_TEAM: 'CMS System/Service Team',
    IT_ARCHITECT: 'IT Architect',
    LEADERSHIP: 'Leadership',
    MEDICARE_ADMINISTRATIVE_CONTRACTOR: 'Medicare Administrative Contractor',
    MINT_TEAM: 'MINT Team',
    MODEL_IT_LEAD: 'Model IT Lead',
    MODEL_TEAM: 'Model Team',
    SHARED_SYSTEM_MAINTAINER: 'Shared System Maintainer',
    NONE_OF_THE_ABOVE: 'None of the above'
  },
  discussionCSV: {
    content: 'Discussion content',
    createdBy: 'Discussion created by',
    createdAt: 'Discussion created at',
    userRole: 'User role',
    userRoleDescription: 'User role description'
  },
  replyCSV: {
    content: 'Reply content',
    createdBy: 'Reply created by',
    createdAt: 'Reply created at',
    userRole: 'User role',
    userRoleDescription: 'User role description'
  },
  showReplies: 'Show replies',
  hideReplies: 'Hide replies',
  tagAlert:
    'When you save your discussion, the selected team(s) and individual(s) will be notified via email.',
  noResults:
    'There are no teams or users that match your search. Please try again.'
};

export default discussions;
