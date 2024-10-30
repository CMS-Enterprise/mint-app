import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetNotifications {
    currentUser {
      notifications {
        numUnreadNotifications
        notifications {
          __typename
          id
          isRead
          inAppSent
          emailSent
          createdDts
          activity {
            activityType
            entityID
            actorID
            actorUserAccount {
              commonName
            }
            metaData {
              __typename
              ... on NewDiscussionRepliedActivityMeta {
                version
                type
                discussionID
                replyID
                modelPlanID
                modelPlan {
                  modelName
                }
                content
              }
              ... on DatesChangedActivityMeta {
                version
                type
                modelPlan {
                  modelName
                }
                modelPlanID
                dateChanges {
                  isChanged
                  field
                  isRange
                  oldDate
                  newDate
                  oldRangeStart
                  oldRangeEnd
                  newRangeStart
                  newRangeEnd
                }
              }
              ... on TaggedInPlanDiscussionActivityMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
                discussionID
                content
              }
              ... on AddedAsCollaboratorMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
              }
              ... on TaggedInDiscussionReplyActivityMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
                discussionID
                replyID
                content
              }
              ... on ModelPlanSharedActivityMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
                optionalMessage
              }
              ... on NewModelPlanActivityMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
              }
              ... on DailyDigestCompleteActivityMeta {
                version
                type
                modelPlanIDs
                date
                analyzedAudits {
                  id
                  modelPlanID
                  modelName
                  date
                  changes {
                    modelPlan {
                      oldName
                      statusChanges
                    }
                    documents {
                      count
                    }
                    crTdls {
                      activity
                    }
                    planSections {
                      updated
                      readyForReview
                      readyForClearance
                      dataExchangeApproachMarkedComplete
                    }
                    modelLeads {
                      added {
                        id
                        commonName
                      }
                    }
                    planDiscussions {
                      activity
                    }
                  }
                }
              }
              ... on PlanDataExchangeApproachMarkedCompleteActivityMeta {
                version
                type
                modelPlan {
                  id
                  modelName
                }
              }
            }
          }
        }
      }
    }
  }
`);
