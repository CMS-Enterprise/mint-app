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
	_, err := resolvers.MTOMilestoneCreateCommon(s.Config.Context, s.Config.Logger, princ, s.Config.Store, plan.ID, models.MTOCommonMilestoneKeyAcquireALearnCont)
	if err != nil {
		panic(err)
	}

	// Make top level and sub categories
	cat0Name := "Category 0"
	cat0SubAName := "Category 0A"
	cat0SubBName := "Category 0B"

	category0, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat0Name, plan.ID, nil)
	if err != nil {
		panic(err)
	}

	category0SubA, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat0SubAName, plan.ID, &category0.ID)
	if err != nil {
		panic(err)
	}
	category0SubB, err := resolvers.MTOCategoryCreate(s.Config.Context, s.Config.Logger, princ, s.Config.Store, cat0SubBName, plan.ID, &category0.ID)
	if err != nil {
		panic(err)
	}

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

	// Make milestones to go under the categories
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat0Name, plan.ID, &category0.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat0SubAName, plan.ID, &category0SubA.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "Milestone"+cat0SubBName, plan.ID, &category0SubB.ID)
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
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "MilestoneB"+cat1SubBName, plan.ID, &category1SubB.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "MilestoneC"+cat1SubBName, plan.ID, &category1SubB.ID)
	if err != nil {
		panic(err)
	}
	_, err = resolvers.MTOMilestoneCreateCustom(s.Config.Context, s.Config.Logger, princ, s.Config.Store, "MilestoneD"+cat1SubBName, plan.ID, &category1SubB.ID)
	if err != nil {
		panic(err)
	}

	return plan

}
