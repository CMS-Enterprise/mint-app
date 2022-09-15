package main

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/local"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// createModelPlan is a wrapper for resolvers.ModelPlanCreate
// It will panic if an error occurs, rather than bubbling the error up
func createModelPlan(store *storage.Store, logger *zap.Logger, modelName string, euaID string) *models.ModelPlan {
	localLDAP := local.NewCedarLdapClient(logger)
	userInfo, err := localLDAP.FetchUserInfo(context.TODO(), euaID)
	if err != nil {
		panic(err)
	}
	princ := &authentication.EUAPrincipal{
		EUAID:             userInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}
	plan, err := resolvers.ModelPlanCreate(logger, modelName, store, userInfo, princ)
	if err != nil {
		panic(err)
	}
	return plan
}

// updateModelPlan is a wrapper for resolvers.ModelPlanUpdate
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the model plan with the principal value of the Model Plan's "createdBy"
func updateModelPlan(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, changes map[string]interface{}) *models.ModelPlan {
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}
	updated, err := resolvers.ModelPlanUpdate(logger, mp.ID, changes, princ, store)
	if err != nil {
		panic(err)
	}
	return updated
}

// updatePlanBasics is a wrapper for resolvers.PlanBasicsGetByModelPlanID and resolvers.UpdatePlanBasics
// It will panic if an error occurs, rather than bubbling the error up
// It will always update the Plan Basics object with the principal value of the Model Plan's "createdBy"
func updatePlanBasics(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, changes map[string]interface{}) *models.PlanBasics {
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

	basics, err := resolvers.PlanBasicsGetByModelPlanID(logger, mp.ID, store)
	if err != nil {
		panic(err)
	}

	updated, err := resolvers.UpdatePlanBasics(logger, basics.ID, changes, princ, store)
	if err != nil {
		panic(err)
	}
	return updated
}

// addPlanCollaborator is a wrapper for resolvers.CreatePlanCollaborator
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the collaborator object with the principal value of the Model Plan's "createdBy"
func addPlanCollaborator(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, input *model.PlanCollaboratorCreateInput) *models.PlanCollaborator {
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

	collaborator, err := resolvers.CreatePlanCollaborator(logger, input, princ, store)
	if err != nil {
		panic(err)
	}
	return collaborator
}

// crTdlCreate is a wrapper for resolvers.PlanCrTdlCreate
// It will panic if an error occurs, rather than bubbling the error up
// It will always add the CR/TDL object with the principal value of the Model Plan's "createdBy"
func addCrTdl(store *storage.Store, logger *zap.Logger, mp *models.ModelPlan, input *model.PlanCrTdlCreateInput) *models.PlanCrTdl {
	princ := &authentication.EUAPrincipal{
		EUAID:             mp.CreatedBy,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: false,
	}

	collaborator, err := resolvers.PlanCrTdlCreate(logger, input, princ, store)
	if err != nil {
		panic(err)
	}
	return collaborator
}
