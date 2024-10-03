// Package loaders is a responsible for batched data calls
package loaders

import (
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// DataLoaders wrap your data loaders to inject via middleware
// TODO: (loaders) WrappedDataLoaders are the legacy loaders, which should be refactored to use the v7 library
type DataLoaders struct {
	GeneralCharacteristicsLoader          *WrappedDataLoader
	ParticipantsAndProvidersLoader        *WrappedDataLoader
	BeneficiariesLoader                   *WrappedDataLoader
	OperationsEvaluationAndLearningLoader *WrappedDataLoader
	PaymentLoader                         *WrappedDataLoader
	PlanCollaboratorByModelPlanLoader     *WrappedDataLoader

	PlanCollaboratorByIDLoader *WrappedDataLoader

	DiscussionLoader      *WrappedDataLoader
	DiscussionReplyLoader *WrappedDataLoader

	OperationalNeedLoader                    *WrappedDataLoader
	OperationSolutionSubtaskLoader           *WrappedDataLoader
	UserAccountLoader                        *WrappedDataLoader
	DataReader                               *dataReader
	ExistingModelLinkLoader                  *WrappedDataLoader
	ExistingModelLinkNameLoader              *WrappedDataLoader
	ExistingModelLoader                      *WrappedDataLoader
	ModelPlanOpSolutionLastModifiedDtsLoader *WrappedDataLoader

	PossibleOperationSolutionByKeyLoader   *WrappedDataLoader
	PossibleOperationSolutionContactLoader *WrappedDataLoader

	ActivityLoader                    *WrappedDataLoader
	UserNotificationPreferencesLoader *WrappedDataLoader

	AnalyzedAuditLoader *WrappedDataLoader

	TranslatedAuditFieldCollectionLoader *WrappedDataLoader

	modelPlan  modelPlanLoader
	planBasics planBasicsLoaders

	operationalSolutions operationalSolutionsLoaders
	myMap                HolderMap
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &dataReader{
			Store: store,
		},
	}

	// TODO: (loaders)  Old Dataloaders, convert to the new style (V7) Anything that uses WrappedDataLoader will be refactored

	loaders.GeneralCharacteristicsLoader = newWrappedDataLoader(loaders.GetPlanGeneralCharacteristicsByModelPlanID)
	loaders.ParticipantsAndProvidersLoader = newWrappedDataLoader(loaders.GetPlanParticipantsAndProvidersByModelPlanID)
	loaders.BeneficiariesLoader = newWrappedDataLoader(loaders.GetPlanBeneficiariesByModelPlanID)
	loaders.OperationsEvaluationAndLearningLoader = newWrappedDataLoader(loaders.GetPlanOpsEvalAndLearningByModelPlanID)
	loaders.PaymentLoader = newWrappedDataLoader(loaders.GetPlanPaymentsByModelPlanID)
	loaders.PlanCollaboratorByModelPlanLoader = newWrappedDataLoader(loaders.GetPlanCollaboratorByModelPlanID)

	loaders.PlanCollaboratorByIDLoader = newWrappedDataLoader(loaders.getPlanCollaboratorByIDBatch)

	loaders.DiscussionLoader = newWrappedDataLoader(loaders.GetPlanDiscussionByModelPlanID)
	loaders.DiscussionReplyLoader = newWrappedDataLoader(loaders.GetDiscussionReplyByModelPlanID)

	loaders.OperationalNeedLoader = newWrappedDataLoader(loaders.GetOperationalNeedsByModelPlanID)
	loaders.OperationSolutionSubtaskLoader = newWrappedDataLoader(loaders.GetOperationalSolutionSubtaskByModelPlanID)
	loaders.UserAccountLoader = newWrappedDataLoader(loaders.GetUserAccountsByIDLoader)

	loaders.ExistingModelLinkLoader = newWrappedDataLoader(loaders.GetExistingModelLinkByModelPlanIDAndFieldName)
	loaders.ExistingModelLinkNameLoader = newWrappedDataLoader(loaders.GetExistingModelLinkNamesByModelPlanIDAndFieldName)
	loaders.ExistingModelLoader = newWrappedDataLoader(loaders.GetExistingModelByModelPlanID)
	loaders.ModelPlanOpSolutionLastModifiedDtsLoader = newWrappedDataLoader(loaders.GetModelPlanOpSolutionLastModifiedDtsByModelPlanID)

	loaders.PossibleOperationSolutionByKeyLoader = newWrappedDataLoader(loaders.possibleOperationalSolutionByKeyBatch)
	loaders.PossibleOperationSolutionContactLoader = newWrappedDataLoader(loaders.PossibleOperationalSolutionContactsGetByPossibleSolutionID)

	loaders.ActivityLoader = newWrappedDataLoader(loaders.activityGetByIDLoaderBatch)
	loaders.UserNotificationPreferencesLoader = newWrappedDataLoader(loaders.userNotificationPreferencesGetByUserIDBatch)

	loaders.AnalyzedAuditLoader = newWrappedDataLoader(loaders.analyzedAuditGetByModelPlanIDAndDateBatch)

	loaders.TranslatedAuditFieldCollectionLoader = newWrappedDataLoader(loaders.translatedAuditFieldCollectionGetByTranslatedAuditIDBatch)

	// TODO (loaders) can we associate the parent field

	// New V7 loaders rely on generics. They have a configuration, and a parent level struct that holds and initializes the dataloaders

	loaders.modelPlan = newModelPlanLoaders()
	loaders.planBasics = newPlanBasicsLoaders()
	loaders.operationalSolutions = newOperationalSolutionsLoaders()
	// myMap := LoaderMap[any,any]{
	// 	"model_plan": loaders.modelPlan.ByID,

	// }

	myMap := HolderMap{
		"model_plan": &loaders.modelPlan,
	}
	loaders.myMap = myMap

	return loaders
}

// dataReader is responsible for database access
type dataReader struct {
	Store *storage.Store
}
