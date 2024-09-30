// Package loaders is a responsible for batched data calls
package loaders

import (
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// DataLoaders wrap your data loaders to inject via middleware
type DataLoaders struct {
	BasicsLoader                          *WrappedDataLoader
	GeneralCharacteristicsLoader          *WrappedDataLoader
	ParticipantsAndProvidersLoader        *WrappedDataLoader
	BeneficiariesLoader                   *WrappedDataLoader
	OperationsEvaluationAndLearningLoader *WrappedDataLoader
	PaymentLoader                         *WrappedDataLoader
	PlanCollaboratorByModelPlanLoader     *WrappedDataLoader

	PlanCollaboratorByIDLoader *WrappedDataLoader

	DiscussionLoader      *WrappedDataLoader
	DiscussionReplyLoader *WrappedDataLoader

	OperationalNeedLoader                          *WrappedDataLoader
	OperationalSolutionLoader                      *WrappedDataLoader
	OperationalSolutionAndPossibleCollectionLoader *WrappedDataLoader
	OperationSolutionSubtaskLoader                 *WrappedDataLoader
	UserAccountLoader                              *WrappedDataLoader
	DataReader                                     *dataReader
	ExistingModelLinkLoader                        *WrappedDataLoader
	ExistingModelLinkNameLoader                    *WrappedDataLoader
	ExistingModelLoader                            *WrappedDataLoader
	ModelPlanOpSolutionLastModifiedDtsLoader       *WrappedDataLoader

	PossibleOperationSolutionByKeyLoader   *WrappedDataLoader
	PossibleOperationSolutionContactLoader *WrappedDataLoader

	ActivityLoader                    *WrappedDataLoader
	UserNotificationPreferencesLoader *WrappedDataLoader

	AnalyzedAuditLoader *WrappedDataLoader

	TranslatedAuditFieldCollectionLoader *WrappedDataLoader

	modelPlan  modelPlanLoader
	planBasics planBasicsLoaders

	// planBasicsByModelPlanID *dataloader.Loader[uuid.UUID, *models.PlanBasics]
	//TODO (loaders) consider creating nested parent fields, eg Basics has
}

// NewDataLoaders instantiates data loaders for the middleware
func NewDataLoaders(store *storage.Store) *DataLoaders {
	loaders := &DataLoaders{
		DataReader: &dataReader{
			Store: store,
		},
	}
	loaders.BasicsLoader = newWrappedDataLoader(loaders.GetPlanBasicsByModelPlanID)
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
	loaders.OperationalSolutionLoader = newWrappedDataLoader(loaders.OperationalSolutionGetByID)
	loaders.OperationalSolutionAndPossibleCollectionLoader = newWrappedDataLoader(loaders.GetOperationalSolutionAndPossibleCollectionByOperationalNeedID)
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
	// loaders.planBasicsByModelPlanID = PlanBasics.GetByModelPlanID.NewBatchedLoader()
	// loaders.planBasicsByModelPlanID = PlanBasics.GetByModelPlanID.NewBatchedLoader()
	// loaders.basics = planBasicsLoaders{
	// 	ByModelPlanID: PlanBasics.GetByModelPlanID.NewBatchedLoader(),
	// }
	// loaders.basics = planBasicsLoaders{}
	// loaders.basics.Init()
	loaders.modelPlan = newModelPlanLoaders()
	loaders.planBasics = newPlanBasicsLoaders()

	return loaders
}

// dataReader is responsible for database access
type dataReader struct {
	Store *storage.Store
}
