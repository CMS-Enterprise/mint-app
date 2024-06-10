import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetChangeHistory($modelPlanID: UUID!) {
    translatedAuditCollection(modelPlanID: $modelPlanID) {
      id
      tableName
      date
      action
      actorName
      translatedFields {
        id
        changeType
        dataType
        fieldName
        fieldNameTranslated
        referenceLabel
        questionType
        notApplicableQuestions
        old
        oldTranslated
        new
        newTranslated
      }
      metaData {
        ... on TranslatedAuditMetaBaseStruct {
          version
          tableName
        }
        ... on TranslatedAuditMetaGeneric {
          version
          tableName
          relation
          relationContent
        }
        ... on TranslatedAuditMetaDiscussionReply {
          version
          tableName
          discussionID
          discussionContent
          numberOfReplies
        }
        ... on TranslatedAuditMetaOperationalNeed {
          version
          tableName
          needName
          isOther
        }
        ... on TranslatedAuditMetaOperationalSolution {
          version
          tableName
          needName
          needIsOther
          solutionName
          solutionOtherHeader
          solutionIsOther
          solutionStatus
          solutionMustStart
          solutionMustFinish
          numberOfSubtasks
        }
        ... on TranslatedAuditMetaOperationalSolutionSubtask {
          version
          tableName
          needName
          needIsOther
          solutionName
          solutionOtherHeader
          solutionIsOther
          subtaskName
          numberOfSubtasks
        }
        ... on TranslatedAuditMetaDocumentSolutionLink {
          version
          tableName
          solutionName
          solutionOtherHeader
          solutionIsOther
          needName
          needIsOther
          documentName
          documentType
          documentOtherType
          documentVisibility
          documentID
        }
      }
    }
  }
`);
