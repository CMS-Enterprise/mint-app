package resolvers

import (
	"github.com/google/uuid"
)

const eChimpCR1Id = "FFS3559"
const eChimpTDL1Id = "TDL240535"

var eChimp1relatedMPID = uuid.MustParse("082b49d3-b548-48cb-9119-77a281bc2a8c")

const eChimpCR2Id = "FFS3550"
const eChimpTDL2Id = "TDL240539"

var eChimp2relatedMPID = uuid.MustParse("003032aa-4a75-49c1-8dca-91e645c4384f")

var eEChimpModelIDS = []uuid.UUID{eChimp1relatedMPID, eChimp2relatedMPID}

// GetEChimpCRsByModelPlanID returns echimp CRS from the cache for a specific model plan
func (suite *ResolverSuite) TestGetEChimpCRsByModelPlanID() {

	result, err := GetEChimpCRsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpCR1Id, result[0].CrNumber)
	}

	result, err = GetEChimpCRsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp2relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpCR2Id, result[0].CrNumber)
	}

}

func (suite *ResolverSuite) TestGetEChimpTDLSByModelPlanID() {

	result, err := GetEChimpTDLSByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpTDL1Id, result[0].TdlNumber)
	}

	result, err = GetEChimpTDLSByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp2relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpTDL2Id, result[0].TdlNumber)
	}

}

func (suite *ResolverSuite) TestGetEchimpCRAndTdlsByModelPlanID() {
	result, err := GetEchimpCRAndTdlsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 2)

	result, err = GetEchimpCRAndTdlsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 2)

}

func (suite *ResolverSuite) TestGetEChimpCRByID() {

	result, err := GetEChimpCRByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimpCR1Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpCR1Id, result.CrNumber)
	}

	result, err = GetEChimpCRByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimpCR2Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpCR2Id, result.CrNumber)
	}

}

func (suite *ResolverSuite) TestGetEChimpTDLByID() {

	result, err := GetEChimpTDLByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimpTDL1Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpTDL1Id, result.TdlNumber)
	}

	result, err = GetEChimpTDLByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimpTDL2Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpTDL2Id, result.TdlNumber)
	}

}
