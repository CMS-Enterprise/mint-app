import { gql } from '@apollo/client';

export default gql`
  query GetModelPlan($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modelCategory
      cmsCenters
      cmsOther
      cmmiGroups
      modifiedDts
      archived
      status
      basics {
        id
        modelPlanID
        modelType
        problem
        goal
        testInventions
        note
        status
      }
      milestones {
        id
        modelPlanID
        completeICIP
        clearanceStarts
        clearanceEnds
        announced
        applicationsStart
        applicationsEnd
        performancePeriodStarts
        performancePeriodEnds
        highLevelNote
        wrapUpEnds
        phasedIn
        phasedInNote
        status
      }
      documents {
        id
        fileName
      }
      discussions {
        id
        content
        createdBy
        createdDts
        status
        replies {
          id
          discussionID
          content
          createdBy
          createdDts
          resolution
        }
      }
      generalCharacteristics {
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      providersAndParticipants {
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
    }
  }
`;
