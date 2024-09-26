package resolvers

import (
	"github.com/google/uuid"
)

const eChimpCR1Id = "FFS3559"
const eChimpTDL1Id = "TDL240535"
const eChimp1relatedMPID = "082b49d3-b548-48cb-9119-77a281bc2a8c"

const eChimpCR2Id = "FFS3550"
const eChimpTDL2Id = "TDL240539"
const eChimp2relatedMPID = "003032aa-4a75-49c1-8dca-91e645c4384f"

// GetEChimpCRs returns echimp CRS from the cache
func (suite *ResolverSuite) TestGetEChimpCRs() {

	crs, err := GetEChimpCRs(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig)
	suite.NoError(err)
	suite.Len(crs, 2)

}

// GetEChimpCRsByModelPlanID returns echimp CRS from the cache for a specific model plan
func (suite *ResolverSuite) TestGetEChimpCRsByModelPlanID() {
	mpID1 := uuid.MustParse(eChimp1relatedMPID)

	result, err := GetEChimpCRsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, mpID1)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpCR1Id, result[0].CrNumber)
	}

	mpID2 := uuid.MustParse(eChimp2relatedMPID)

	result, err = GetEChimpCRsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, mpID2)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpCR2Id, result[0].CrNumber)
	}

}

func (suite *ResolverSuite) TestGetEChimpTDLS() {
	result, err := GetEChimpTDLS(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig)
	suite.NoError(err)
	suite.NotNil(result)
}

func (suite *ResolverSuite) TestGetEChimpTDLSByModelPlanID() {
	mpID1 := uuid.MustParse(eChimp1relatedMPID)
	result, err := GetEChimpTDLSByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, mpID1)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpTDL1Id, result[0].TdlNumber)
	}

	mpID2 := uuid.MustParse(eChimp2relatedMPID)
	result, err = GetEChimpTDLSByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, mpID2)
	suite.NoError(err)
	suite.NotNil(result)
	if suite.Len(result, 1) {
		suite.EqualValues(eChimpTDL2Id, result[0].TdlNumber)
	}

}

func (suite *ResolverSuite) TestGetEchimpCRAndTdls() {
	result, err := GetEchimpCRAndTdls(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

}

func (suite *ResolverSuite) TestGetEchimpCRAndTdlsByModelPlanID() {
	mpID1 := uuid.MustParse(eChimp1relatedMPID)
	result, err := GetEchimpCRAndTdlsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, mpID1)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 2)

	mpID2 := uuid.MustParse(eChimp1relatedMPID)
	result, err = GetEchimpCRAndTdlsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, mpID2)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 2)

}

func (suite *ResolverSuite) TestGetEChimpCRByID() {

	result, err := GetEChimpCRByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, eChimpCR1Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpCR1Id, result.CrNumber)
	}

	result, err = GetEChimpCRByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, eChimpCR2Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpCR2Id, result.CrNumber)
	}

}

func (suite *ResolverSuite) TestGetEChimpTDLByID() {

	result, err := GetEChimpTDLByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, eChimpTDL1Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpTDL1Id, result.TdlNumber)
	}

	result, err = GetEChimpTDLByID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, eChimpTDL2Id)
	suite.NoError(err)

	if suite.NotNil(result) {
		suite.EqualValues(eChimpTDL2Id, result.TdlNumber)
	}

}
