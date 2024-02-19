// Package loaders is a responsible for batched data calls
package loaders

import "github.com/cmsgov/mint-app/pkg/storage"

// DataLoaders wrap your data loaders to inject via middleware
type DataLoaders struct {
	BasicsLoader                          *WrappedDataLoader
	GeneralCharacteristicsLoader          *WrappedDataLoader
	ParticipantsAndProvidersLoader        *WrappedDataLoader
	BeneficiariesLoader                   *WrappedDataLoader
	OperationsEvaluationAndLearningLoader *WrappedDataLoader
	PaymentLoader                         *WrappedDataLoader
	PlanCollaboratorLoader                *WrappedDataLoader

	DiscussionLoader      *WrappedDataLoader
	DiscussionReplyLoader *WrappedDataLoader

	OperationalNeedLoader          *WrappedDataLoader
	OperationSolutionLoader        *WrappedDataLoader
	OperationSolutionSubtaskLoader *WrappedDataLoader
	UserAccountLoader              *WrappedDataLoader
	DataReader                     *DataReader
	ExistingModelLinkLoader        *WrappedDataLoader
	ExistingModelLinkNameLoader    *WrappedDataLoader
	ExistingModelLoader            *WrappedDataLoader
	ModelPlanLoader                *WrappedDataLoader

	PossibleOperationSolutionContactLoader *WrappedDataLoader

	ActivityLoader *WrappedDataLoader
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &DataReader{
			Store: store,
		},
	}
	loaders.BasicsLoader = newWrappedDataLoader(loaders.GetPlanBasicsByModelPlanID)
	loaders.GeneralCharacteristicsLoader = newWrappedDataLoader(loaders.GetPlanGeneralCharacteristicsByModelPlanID)
	loaders.ParticipantsAndProvidersLoader = newWrappedDataLoader(loaders.GetPlanParticipantsAndProvidersByModelPlanID)
	loaders.BeneficiariesLoader = newWrappedDataLoader(loaders.GetPlanBeneficiariesByModelPlanID)
	loaders.OperationsEvaluationAndLearningLoader = newWrappedDataLoader(loaders.GetPlanOpsEvalAndLearningByModelPlanID)
	loaders.PaymentLoader = newWrappedDataLoader(loaders.GetPlanPaymentsByModelPlanID)
	loaders.PlanCollaboratorLoader = newWrappedDataLoader(loaders.GetPlanCollaboratorByModelPlanID)

	loaders.DiscussionLoader = newWrappedDataLoader(loaders.GetPlanDiscussionByModelPlanID)
	loaders.DiscussionReplyLoader = newWrappedDataLoader(loaders.GetDiscussionReplyByModelPlanID)

	loaders.OperationalNeedLoader = newWrappedDataLoader(loaders.GetOperationalNeedsByModelPlanID)
	loaders.OperationSolutionLoader = newWrappedDataLoader(loaders.GetOperationalSolutionAndPossibleCollectionByOperationalNeedID)
	loaders.OperationSolutionSubtaskLoader = newWrappedDataLoader(loaders.GetOperationalSolutionSubtaskByModelPlanID)
	loaders.UserAccountLoader = newWrappedDataLoader(loaders.GetUserAccountsByIDLoader)

	loaders.ExistingModelLinkLoader = newWrappedDataLoader(loaders.GetExistingModelLinkByModelPlanIDAndFieldName)
	loaders.ExistingModelLinkNameLoader = newWrappedDataLoader(loaders.GetExistingModelLinkNamesByModelPlanIDAndFieldName)
	loaders.ExistingModelLoader = newWrappedDataLoader(loaders.GetExistingModelByModelPlanID)
	loaders.ModelPlanLoader = newWrappedDataLoader(loaders.GetModelPlanByModelPlanID)

	loaders.PossibleOperationSolutionContactLoader = newWrappedDataLoader(loaders.PossibleOperationalSolutionContactsGetByPossibleSolutionID)

	loaders.ActivityLoader = newWrappedDataLoader(loaders.activityGetByIDLoaderBatch)

	return loaders
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}
