package resolvers

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestCustomTimelineDateCreateSingleClearsEndDate() {
	plan := suite.createModelPlan("Custom Timeline Date Create Single")
	startDate := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2026, 1, 15, 0, 0, 0, 0, time.UTC)
	description := "single date description"

	input := &model.CustomTimelineDateCreateInput{
		ModelPlanID: plan.ID,
		Title:       "Single custom date",
		Description: &description,
		DateType:    models.CustomTimelineDateTypeSingle,
		StartDate:   startDate,
		EndDate:     &endDate,
	}

	customTimelineDate, err := CustomTimelineDateCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.NotNil(customTimelineDate)
	suite.NotEqual(uuid.Nil, customTimelineDate.ID)
	suite.EqualValues(plan.ID, customTimelineDate.ModelPlanID)
	suite.EqualValues("Single custom date", customTimelineDate.Title)
	suite.EqualValues(description, *customTimelineDate.Description)
	suite.EqualValues(models.CustomTimelineDateTypeSingle, customTimelineDate.DateType)
	suite.WithinDuration(startDate, customTimelineDate.StartDate, time.Second)
	suite.Nil(customTimelineDate.EndDate)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, customTimelineDate.CreatedBy)
	suite.Nil(customTimelineDate.ModifiedBy)
	suite.Nil(customTimelineDate.ModifiedDts)
}

func (suite *ResolverSuite) TestCustomTimelineDateCreateRangeRequiresEndDate() {
	plan := suite.createModelPlan("Custom Timeline Date Create Range Requires End")
	startDate := time.Date(2026, 2, 1, 0, 0, 0, 0, time.UTC)

	input := &model.CustomTimelineDateCreateInput{
		ModelPlanID: plan.ID,
		Title:       "Range custom date",
		DateType:    models.CustomTimelineDateTypeRange,
		StartDate:   startDate,
	}

	customTimelineDate, err := CustomTimelineDateCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.Error(err)
	suite.Nil(customTimelineDate)
	suite.Contains(err.Error(), "end date is required")
}

func (suite *ResolverSuite) TestCustomTimelineDateGetByIDLoader() {
	plan := suite.createModelPlan("Custom Timeline Date Get By ID")
	startDate := time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC)
	customTimelineDate := suite.createCustomTimelineDate(
		plan,
		"Date to fetch",
		models.CustomTimelineDateTypeSingle,
		startDate,
		nil,
	)

	retrievedDate, err := CustomTimelineDateGetByIDLOADER(suite.testConfigs.Context, customTimelineDate.ID)

	suite.NoError(err)
	suite.NotNil(retrievedDate)
	suite.EqualValues(customTimelineDate.ID, retrievedDate.ID)
	suite.EqualValues(customTimelineDate.ModelPlanID, retrievedDate.ModelPlanID)
	suite.EqualValues(customTimelineDate.Title, retrievedDate.Title)
	suite.EqualValues(customTimelineDate.DateType, retrievedDate.DateType)
	suite.WithinDuration(customTimelineDate.StartDate, retrievedDate.StartDate, time.Second)
}

func (suite *ResolverSuite) TestCustomTimelineDateGetByModelPlanIDLoaderOrdersOldToNew() {
	plan := suite.createModelPlan("Custom Timeline Dates Ordered")
	otherPlan := suite.createModelPlan("Custom Timeline Dates Other Plan")

	newDate := suite.createCustomTimelineDate(
		plan,
		"Newest custom date",
		models.CustomTimelineDateTypeSingle,
		time.Date(2026, 5, 1, 0, 0, 0, 0, time.UTC),
		nil,
	)
	oldDate := suite.createCustomTimelineDate(
		plan,
		"Oldest custom date",
		models.CustomTimelineDateTypeSingle,
		time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC),
		nil,
	)
	middleDate := suite.createCustomTimelineDate(
		plan,
		"Middle custom date",
		models.CustomTimelineDateTypeSingle,
		time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC),
		nil,
	)
	_ = suite.createCustomTimelineDate(
		otherPlan,
		"Other plan custom date",
		models.CustomTimelineDateTypeSingle,
		time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		nil,
	)

	customTimelineDates, err := CustomTimelineDateGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.Len(customTimelineDates, 3)
	suite.EqualValues([]uuid.UUID{oldDate.ID, middleDate.ID, newDate.ID}, []uuid.UUID{
		customTimelineDates[0].ID,
		customTimelineDates[1].ID,
		customTimelineDates[2].ID,
	})
}

func (suite *ResolverSuite) TestCustomTimelineDateUpdateAppliesChangesAndClearsEndDateForSingle() {
	plan := suite.createModelPlan("Custom Timeline Date Update Single")
	startDate := time.Date(2026, 4, 1, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2026, 4, 15, 0, 0, 0, 0, time.UTC)
	customTimelineDate := suite.createCustomTimelineDate(
		plan,
		"Range to update",
		models.CustomTimelineDateTypeRange,
		startDate,
		&endDate,
	)
	nextEndDate := endDate.AddDate(0, 0, 7)

	changes := map[string]any{
		"title":    "Updated single custom date",
		"dateType": models.CustomTimelineDateTypeSingle,
		"endDate":  &nextEndDate,
	}

	updatedDate, err := CustomTimelineDateUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		customTimelineDate.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.NotNil(updatedDate)
	suite.EqualValues(customTimelineDate.ID, updatedDate.ID)
	suite.EqualValues("Updated single custom date", updatedDate.Title)
	suite.EqualValues(models.CustomTimelineDateTypeSingle, updatedDate.DateType)
	suite.Nil(updatedDate.EndDate)
	suite.NotNil(updatedDate.ModifiedBy)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedDate.ModifiedBy)
	suite.NotNil(updatedDate.ModifiedDts)
}

func (suite *ResolverSuite) TestCustomTimelineDateUpdateRangeRequiresEndDate() {
	plan := suite.createModelPlan("Custom Timeline Date Update Range Requires End")
	customTimelineDate := suite.createCustomTimelineDate(
		plan,
		"Single to update",
		models.CustomTimelineDateTypeSingle,
		time.Date(2026, 6, 1, 0, 0, 0, 0, time.UTC),
		nil,
	)

	changes := map[string]any{
		"dateType": models.CustomTimelineDateTypeRange,
	}

	updatedDate, err := CustomTimelineDateUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		customTimelineDate.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.Error(err)
	suite.Nil(updatedDate)
	suite.Contains(err.Error(), "end date is required")
}

func (suite *ResolverSuite) TestCustomTimelineDateDelete() {
	plan := suite.createModelPlan("Custom Timeline Date Delete")
	customTimelineDate := suite.createCustomTimelineDate(
		plan,
		"Custom date to delete",
		models.CustomTimelineDateTypeSingle,
		time.Date(2026, 7, 1, 0, 0, 0, 0, time.UTC),
		nil,
	)

	deletedDate, err := DeleteCustomTimelineDate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		customTimelineDate.ID,
	)

	suite.NoError(err)
	suite.NotNil(deletedDate)
	suite.EqualValues(customTimelineDate.ID, deletedDate.ID)

	remainingDates, err := storage.CustomTimelineDateGetByModelPlanIDLoader(suite.testConfigs.Store, []uuid.UUID{plan.ID})
	suite.NoError(err)
	suite.Empty(remainingDates)
}

func (suite *ResolverSuite) createCustomTimelineDate(
	plan *models.ModelPlan,
	title string,
	dateType models.CustomTimelineDateType,
	startDate time.Time,
	endDate *time.Time,
) *models.CustomTimelineDate {
	customTimelineDate, err := CustomTimelineDateCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		&model.CustomTimelineDateCreateInput{
			ModelPlanID: plan.ID,
			Title:       title,
			DateType:    dateType,
			StartDate:   startDate,
			EndDate:     endDate,
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	return customTimelineDate
}
