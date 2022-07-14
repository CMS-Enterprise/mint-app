import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageSix($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        dataNeededForMonitoring
      }
      itTools {
        id
        oelObtainData
        oelObtainDataOther
        oelObtainDataNote
        oelClaimsBasedMeasures
        oelClaimsBasedMeasuresOther
        oelClaimsBasedMeasuresNote
        oelQualityScores
        oelQualityScoresOther
        oelQualityScoresNote
      }
    }
  }
`;
