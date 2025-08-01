package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// UpdatePlanParticipantsAndProviders is the resolver for the updatePlanParticipantsAndProviders field.
func (r *mutationResolver) UpdatePlanParticipantsAndProviders(ctx context.Context, id uuid.UUID, changes map[string]any) (*models.PlanParticipantsAndProviders, error) {
	principal := appcontext.Principal(ctx)
	logger := appcontext.ZLogger(ctx)
	return PlanParticipantsAndProvidersUpdate(logger, id, changes, principal, r.store)
}

// Participants is the resolver for the participants field.
func (r *planParticipantsAndProvidersResolver) Participants(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantsType, error) {
	participants := models.ConvertEnums[model.ParticipantsType](obj.Participants)
	return participants, nil
}

// SelectionMethod is the resolver for the selectionMethod field.
func (r *planParticipantsAndProvidersResolver) SelectionMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantSelectionType, error) {
	selectionTypes := models.ConvertEnums[model.ParticipantSelectionType](obj.SelectionMethod)
	return selectionTypes, nil
}

// ParticipantAddedFrequency is the resolver for the participantAddedFrequency field.
func (r *planParticipantsAndProvidersResolver) ParticipantAddedFrequency(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]models.FrequencyType, error) {
	return models.ConvertEnums[models.FrequencyType](obj.ParticipantAddedFrequency), nil
}

// ParticipantRemovedFrequency is the resolver for the participantRemovedFrequency field.
func (r *planParticipantsAndProvidersResolver) ParticipantRemovedFrequency(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]models.FrequencyType, error) {
	return models.ConvertEnums[models.FrequencyType](obj.ParticipantRemovedFrequency), nil
}

// CommunicationMethod is the resolver for the communicationMethod field.
func (r *planParticipantsAndProvidersResolver) CommunicationMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantCommunicationType, error) {
	communicationTypes := models.ConvertEnums[model.ParticipantCommunicationType](obj.CommunicationMethod)
	return communicationTypes, nil
}

// RiskType is the resolver for the riskType field.
func (r *planParticipantsAndProvidersResolver) RiskType(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]models.ParticipantRiskType, error) {
	return models.ConvertEnums[models.ParticipantRiskType](obj.RiskType), nil
}

// ParticipantRequireFinancialGuaranteeType is the resolver for the participantRequireFinancialGuaranteeType field.
func (r *planParticipantsAndProvidersResolver) ParticipantRequireFinancialGuaranteeType(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantRequireFinancialGuaranteeType, error) {
	guaranteeTypes := models.ConvertEnums[model.ParticipantRequireFinancialGuaranteeType](obj.ParticipantRequireFinancialGuaranteeType)
	return guaranteeTypes, nil
}

// GainsharePaymentsEligibility is the resolver for the gainsharePaymentsEligibility field.
func (r *planParticipantsAndProvidersResolver) GainsharePaymentsEligibility(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.GainshareArrangementEligibility, error) {
	gainshareArrangementEligibilities := models.ConvertEnums[model.GainshareArrangementEligibility](obj.GainsharePaymentsEligibility)
	return gainshareArrangementEligibilities, nil
}

// ParticipantsIds is the resolver for the participantsIds field.
func (r *planParticipantsAndProvidersResolver) ParticipantsIds(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantsIDType, error) {
	participantsIDTypes := models.ConvertEnums[model.ParticipantsIDType](obj.ParticipantsIds)
	return participantsIDTypes, nil
}

// ProviderAdditionFrequency is the resolver for the providerAdditionFrequency field.
func (r *planParticipantsAndProvidersResolver) ProviderAdditionFrequency(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]models.FrequencyType, error) {
	return models.ConvertEnums[models.FrequencyType](obj.ProviderAdditionFrequency), nil
}

// ProviderAddMethod is the resolver for the providerAddMethod field.
func (r *planParticipantsAndProvidersResolver) ProviderAddMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ProviderAddType, error) {
	providerAddTypes := models.ConvertEnums[model.ProviderAddType](obj.ProviderAddMethod)
	return providerAddTypes, nil
}

// ProviderLeaveMethod is the resolver for the providerLeaveMethod field.
func (r *planParticipantsAndProvidersResolver) ProviderLeaveMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ProviderLeaveType, error) {
	providerLeaveTypes := models.ConvertEnums[model.ProviderLeaveType](obj.ProviderLeaveMethod)
	return providerLeaveTypes, nil
}

// ProviderRemovalFrequency is the resolver for the providerRemovalFrequency field.
func (r *planParticipantsAndProvidersResolver) ProviderRemovalFrequency(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]models.FrequencyType, error) {
	return models.ConvertEnums[models.FrequencyType](obj.ProviderRemovalFrequency), nil
}

// PlanParticipantsAndProviders returns generated.PlanParticipantsAndProvidersResolver implementation.
func (r *Resolver) PlanParticipantsAndProviders() generated.PlanParticipantsAndProvidersResolver {
	return &planParticipantsAndProvidersResolver{r}
}

type planParticipantsAndProvidersResolver struct{ *Resolver }
