package main

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

var mtoModelPlanUUID = uuid.MustParse("00000000-0000-0000-0000-000000000005")

func (s *Seeder) seedModelPlanWithMTOData(
	modelName string,
	euaID string,
	id *uuid.UUID) *models.ModelPlan {
	plan := s.createModelPlan(modelName, euaID, id)

	princ := s.getTestPrincipalByUsername(euaID)

	// Make uncategorized Milestone from Common milestone library
	// TODO: This likely won't be uncategorized anymore once common milestones also create categories as needed
	_, err := resolvers.MTOMilestoneCreateCommon(s.Config.Context, s.Config.Logger, princ, s.Config.Store, plan.ID, models.MTOCommonMilestoneKeyMilestoneA)
	if err != nil {
		panic(err)
	}

	// Make top level and sub categories
	cat1Name := "Category 1"
	cat1SubAName := "Category 1A"
	cat1SubBName := "Category 1B"

	category1, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat1Name, plan.ID, nil)
	if err != nil {
		panic(err)
	}

	category1SubA, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat1SubAName, plan.ID, &category1.ID)
	if err != nil {
		panic(err)
	}
	category1SubB, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat1SubBName, plan.ID, &category1.ID)
	if err != nil {
		panic(err)
	}

	cat2Name := "Category 2"
	cat2SubAName := "Category 2A"
	cat2SubBName := "Category 2B"

	category2, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat2Name, plan.ID, nil)
	if err != nil {
		panic(err)
	}

	category2SubA, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat2SubAName, plan.ID, &category2.ID)
	if err != nil {
		panic(err)
	}
	category2SubB, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat2SubBName, plan.ID, &category2.ID)
	if err != nil {
		panic(err)
	}

	// Make milestones to go under the categories
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat1Name, plan.ID, &category1.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat1SubAName, plan.ID, &category1SubA.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat1SubBName, plan.ID, &category1SubB.ID)
	if err != nil {
		panic(err)
	}

	// Make milestones to go under the categories
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat2Name, plan.ID, &category2.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat2SubAName, plan.ID, &category2SubA.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat2SubBName, plan.ID, &category2SubB.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "MilestoneB"+cat2SubBName, plan.ID, &category2SubB.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "MilestoneC"+cat2SubBName, plan.ID, &category2SubB.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "MilestoneD"+cat2SubBName, plan.ID, &category2SubB.ID)
	if err != nil {
		panic(err)
	}

	return plan

}
