package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/s3"
)

// Removed when we deprecated a bunch of unused resolvers in https://github.com/CMS-Enterprise/mint-app/pull/1447
// const eChimpCR1Id = "FFS3559"
// const eChimpTDL1Id = "TDL240535"

var eChimp1relatedMPID = uuid.MustParse("082b49d3-b548-48cb-9119-77a281bc2a8c")

// Removed when we deprecated a bunch of unused resolvers in https://github.com/CMS-Enterprise/mint-app/pull/1447
// const eChimpCR2Id = "FFS3550"
// const eChimpTDL2Id = "TDL240539"

var eChimp2relatedMPID = uuid.MustParse("003032aa-4a75-49c1-8dca-91e645c4384f")

var eEChimpModelIDS = []uuid.UUID{eChimp1relatedMPID, eChimp2relatedMPID}

func (suite *ResolverSuite) TestGetEchimpCRAndTdlsByModelPlanID() {
	result, err := GetEchimpCRAndTdlsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 2)

	result, err = GetEchimpCRAndTdlsByModelPlanID(suite.testConfigs.EChimpS3Client, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 2)

	// Test with an s3 client that expects no bucket
	// Occurs currently in local development where we don't have an S3 bucket set up for echimp
	testConfig := s3.Config{
		Bucket:         "test-bucket",
		Region:         "us-east-1",
		IsLocal:        true,
		ExpectNoBucket: true,
	}
	realClient := s3.NewS3Client(context.TODO(), testConfig)
	result, err = GetEchimpCRAndTdlsByModelPlanID(&realClient, suite.testConfigs.viperConfig, suite.testConfigs.Logger, eChimp1relatedMPID)
	suite.Nil(result)
	suite.Nil(err)
}
