package resolvers

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonMilestoneGetByModelPlanIDLOADER implements resolver logic to get all MTO common milestones by a model plan ID using a data loader
// The modelPlanID is optional. It is used to provide meta data about the CommonMilestone in relation to a model plan (was it added or recommended?)
func MTOCommonMilestoneGetByModelPlanIDLOADER(ctx context.Context, modelPlanID *uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	var key uuid.UUID
	if modelPlanID != nil {
		key = *modelPlanID
	}
	return loaders.MTOCommonMilestone.ByModelPlanID.Load(ctx, key)
}

// MTOCommonMilestoneGetByIDLOADER returns a common milestone by its ID. Currently, it doesn't provide any contextual data.
func MTOCommonMilestoneGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.MTOCommonMilestone, error) {
	// Future Enhancement look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOCommonMilestone.ByID.Load(ctx, id)
}

// MTOSuggestedMilestoneReasonGetByIDLOADER returns all suggestion reasons for a given mto_suggested_milestone ID.
func MTOSuggestedMilestoneReasonGetByIDLOADER(ctx context.Context, id uuid.UUID) ([]*models.MTOSuggestedMilestoneReason, error) {
	return loaders.MTOSuggestedMilestoneReason.ByMTOSuggestedMilestoneID.Load(ctx, id)
}

// CreateMTOCommonMilestone creates a common milestone in the library.
func CreateMTOCommonMilestone(
	logger *zap.Logger,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	name string,
	description string,
	categoryName string,
	subCategoryName *string,
	facilitatedByRole []models.MTOFacilitator,
	facilitatedByOther *string,
	commonSolutions []models.MTOCommonSolutionKey,
	actorUserID uuid.UUID,
	actorUserName string,
) (*models.MTOCommonMilestone, error) {
	createdMilestone, err := storage.MTOCommonMilestoneCreate(
		store,
		name,
		description,
		categoryName,
		subCategoryName,
		facilitatedByRole,
		facilitatedByOther,
		commonSolutions,
		actorUserID,
	)
	if err != nil {
		return nil, err
	}

	if emailService == nil {
		return createdMilestone, nil
	}

	go func() {
		commonSolutionRecords, err := storage.MTOCommonSolutionGetByKeyLoader(store, logger, commonSolutions)
		if err != nil {
			logger.Error("failed to fetch common solutions for common milestone created email", zap.Error(err))
		}

		emailSubject, emailBody, err := email.MTO.CommonMilestone.Added.GetContent(
			email.MTOCommonMilestoneCreatedSubjectContent{MilestoneTitle: createdMilestone.Name},
			email.MTOCommonMilestoneCreatedBodyContent{
				UserName:       actorUserName,
				MilestoneTitle: createdMilestone.Name,
				Description:    createdMilestone.Description,
				CategoryAndSub: formatMTOCommonMilestoneCategory(createdMilestone.CategoryName, createdMilestone.SubCategoryName),
				Roles:          formatMTOCommonMilestoneFacilitators(createdMilestone.FacilitatedByRole, createdMilestone.FacilitatedByOther),
				Solutions:      formatMTOCommonMilestoneSolutions(commonSolutionRecords),
				ClientAddress:  emailService.GetConfig().GetClientAddress(),
			},
		)
		if err != nil {
			logger.Error("failed to render common milestone created email", zap.Error(err))
			return
		}

		err = emailService.Send(
			addressBook.DefaultSender,
			[]string{addressBook.MINTTeamEmail},
			nil,
			emailSubject,
			"text/html",
			emailBody,
		)
		if err != nil {
			logger.Error("failed to send common milestone created email", zap.Error(err))
		}
	}()

	return createdMilestone, nil
}

// UpdateMTOCommonMilestone updates a common milestone in the library.
func UpdateMTOCommonMilestone(
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	id uuid.UUID,
	changes map[string]any,
	commonSolutions []models.MTOCommonSolutionKey,
) (*models.MTOCommonMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingMilestones, err := storage.MTOCommonMilestoneGetByIDLoader(store, logger, []uuid.UUID{id})
	if err != nil {
		return nil, err
	}
	if len(existingMilestones) < 1 {
		return nil, fmt.Errorf("no common milestone found for id %s", id)
	}

	existingMilestone := existingMilestones[0]
	previousMilestone := *existingMilestone

	sendUpdateEmail := emailService != nil
	var previousCommonSolutionRecords []*models.MTOCommonSolution
	if sendUpdateEmail {
		// Updating can replace solution links, so capture the previous values before the update mutation.
		previousCommonSolutionRecords, err = storage.MTOCommonSolutionGetByCommonMilestoneIDLoader(store, logger, []uuid.UUID{id})
		if err != nil {
			logger.Error("failed to fetch previous common solutions for common milestone updated email", zap.Error(err))
			sendUpdateEmail = false
		}
	}

	if err := BaseStructPreUpdate(logger, existingMilestone, changes, principal, store, true, false); err != nil {
		return nil, err
	}

	updatedMilestone, err := storage.MTOCommonMilestoneUpdate(store, existingMilestone, commonSolutions, principalAccount.ID)
	if err != nil {
		return nil, err
	}

	if !sendUpdateEmail {
		return updatedMilestone, nil
	}

	go func() {
		updatedCommonSolutionRecords := previousCommonSolutionRecords
		if commonSolutions != nil {
			var err error
			updatedCommonSolutionRecords, err = storage.MTOCommonSolutionGetByKeyLoader(store, logger, commonSolutions)
			if err != nil {
				logger.Error("failed to fetch updated common solutions for common milestone updated email", zap.Error(err))
				return
			}
		}

		emailSubject, emailBody, err := email.MTO.CommonMilestone.Updated.GetContent(
			email.MTOCommonMilestoneUpdatedSubjectContent{MilestoneTitle: updatedMilestone.Name},
			email.MTOCommonMilestoneUpdatedBodyContent{
				UserName:               principalAccount.CommonName,
				PreviousTitle:          previousMilestone.Name,
				PreviousDescription:    previousMilestone.Description,
				PreviousCategoryAndSub: formatMTOCommonMilestoneCategory(previousMilestone.CategoryName, previousMilestone.SubCategoryName),
				PreviousRoles:          formatMTOCommonMilestoneFacilitators(previousMilestone.FacilitatedByRole, previousMilestone.FacilitatedByOther),
				PreviousSolutions:      formatMTOCommonMilestoneSolutions(previousCommonSolutionRecords),
				NewTitle:               updatedMilestone.Name,
				NewDescription:         updatedMilestone.Description,
				NewCategoryAndSub:      formatMTOCommonMilestoneCategory(updatedMilestone.CategoryName, updatedMilestone.SubCategoryName),
				NewRoles:               formatMTOCommonMilestoneFacilitators(updatedMilestone.FacilitatedByRole, updatedMilestone.FacilitatedByOther),
				NewSolutions:           formatMTOCommonMilestoneSolutions(updatedCommonSolutionRecords),
				ClientAddress:          emailService.GetConfig().GetClientAddress(),
			},
		)
		if err != nil {
			logger.Error("failed to render common milestone updated email", zap.Error(err))
			return
		}

		err = emailService.Send(
			addressBook.DefaultSender,
			[]string{addressBook.MINTTeamEmail},
			nil,
			emailSubject,
			"text/html",
			emailBody,
		)
		if err != nil {
			logger.Error("failed to send common milestone updated email", zap.Error(err))
		}
	}()

	return updatedMilestone, nil
}

// ArchiveMTOCommonMilestone marks a common milestone as archived.
func ArchiveMTOCommonMilestone(
	logger *zap.Logger,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	id uuid.UUID,
	actorUserID uuid.UUID,
	actorUserName string,
) (*models.MTOCommonMilestone, error) {
	if emailService == nil {
		return storage.MTOCommonMilestoneArchive(store, logger, id, actorUserID)
	}

	// Archiving removes common milestone solution links, so capture them before the archive mutation.
	commonSolutionRecords, err := storage.MTOCommonSolutionGetByCommonMilestoneIDLoader(store, logger, []uuid.UUID{id})
	if err != nil {
		logger.Error("failed to fetch common solutions for common milestone removed email", zap.Error(err))
	}

	archivedMilestone, err := storage.MTOCommonMilestoneArchive(store, logger, id, actorUserID)
	if err != nil {
		return nil, err
	}

	go func() {
		emailSubject, emailBody, err := email.MTO.CommonMilestone.Removed.GetContent(
			email.MTOCommonMilestoneRemovedSubjectContent{MilestoneTitle: archivedMilestone.Name},
			email.MTOCommonMilestoneRemovedBodyContent{
				UserName:       actorUserName,
				MilestoneTitle: archivedMilestone.Name,
				Description:    archivedMilestone.Description,
				CategoryAndSub: formatMTOCommonMilestoneCategory(archivedMilestone.CategoryName, archivedMilestone.SubCategoryName),
				Roles:          formatMTOCommonMilestoneFacilitators(archivedMilestone.FacilitatedByRole, archivedMilestone.FacilitatedByOther),
				Solutions:      formatMTOCommonMilestoneSolutions(commonSolutionRecords),
				ClientAddress:  emailService.GetConfig().GetClientAddress(),
			},
		)
		if err != nil {
			logger.Error("failed to render common milestone removed email", zap.Error(err))
			return
		}

		err = emailService.Send(
			addressBook.DefaultSender,
			[]string{addressBook.MINTTeamEmail},
			nil,
			emailSubject,
			"text/html",
			emailBody,
		)
		if err != nil {
			logger.Error("failed to send common milestone removed email", zap.Error(err))
		}
	}()

	return archivedMilestone, nil
}

func formatMTOCommonMilestoneCategory(categoryName string, subCategoryName *string) string {
	if subCategoryName == nil || strings.TrimSpace(*subCategoryName) == "" || strings.TrimSpace(*subCategoryName) == "Uncategorized" {
		return categoryName
	}

	return fmt.Sprintf("%s (%s)", categoryName, *subCategoryName)
}

func formatMTOCommonMilestoneFacilitators(
	facilitatedByRoles []models.MTOFacilitator,
	facilitatedByOther *string,
) string {
	if len(facilitatedByRoles) == 0 {
		return "None"
	}

	roles := make([]string, 0, len(facilitatedByRoles))
	otherRoles := make([]string, 0, 1)
	for _, facilitatedByRole := range facilitatedByRoles {
		if facilitatedByRole == models.MTOFacilitatorOther &&
			facilitatedByOther != nil &&
			strings.TrimSpace(*facilitatedByOther) != "" {
			otherRoles = append(otherRoles, fmt.Sprintf("%s (%s)", humanizeMTOFacilitator(facilitatedByRole), *facilitatedByOther))
			continue
		}

		if facilitatedByRole == models.MTOFacilitatorOther {
			otherRoles = append(otherRoles, humanizeMTOFacilitator(facilitatedByRole))
			continue
		}

		roles = append(roles, humanizeMTOFacilitator(facilitatedByRole))
	}

	roles = append(roles, otherRoles...)
	return strings.Join(roles, ", ")
}

func humanizeMTOFacilitator(facilitator models.MTOFacilitator) string {
	switch facilitator {
	case models.MTOFacilitatorITLead:
		return "IT Lead"
	case models.MTOFacilitatorModelTeam:
		return "Model team"
	case models.MTOFacilitatorModelLead:
		return "Model Lead"
	case models.MTOFacilitatorModelDataLead:
		return "Model Data Lead"
	case models.MTOFacilitatorSolutionArchitect:
		return "Solution Architect"
	case models.MTOFacilitatorITSystemProductOwner:
		return "IT System Product Owner"
	case models.MTOFacilitatorApplicationSupportContractor:
		return "Application support contractor"
	case models.MTOFacilitatorDataAnalyticsContractor:
		return "Data analytics contractor"
	case models.MTOFacilitatorEvaluationContractor:
		return "Evaluation contractor"
	case models.MTOFacilitatorImplementationContractor:
		return "Implementation contractor"
	case models.MTOFacilitatorLearningContractor:
		return "Learning contractor"
	case models.MTOFacilitatorMonitoringContractor:
		return "Monitoring contractor"
	case models.MTOFacilitatorQualityMeasuresDevelopmentContractor:
		return "Quality measures development contractor"
	case models.MTOFacilitatorContractingOfficersRepresentative:
		return "Contracting Officers Representative (COR)"
	case models.MTOFacilitatorLearningAndDiffusionGroup:
		return "Learning and Diffusion Group (LDG)"
	case models.MTOFacilitatorResearchAndRapidCycleEvaluationGroup:
		return "Research and Rapid Cycle Evaluation Group (RREG)"
	case models.MTOFacilitatorParticipants:
		return "Participants"
	case models.MTOFacilitatorOther:
		return "Other"
	default:
		return strings.ReplaceAll(string(facilitator), "_", " ")
	}
}

func formatMTOCommonMilestoneSolutions(commonSolutions []*models.MTOCommonSolution) string {
	if len(commonSolutions) == 0 {
		return "None"
	}

	seenSolutions := map[string]bool{}
	solutionNames := make([]string, 0, len(commonSolutions))
	for _, commonSolution := range commonSolutions {
		if commonSolution == nil || commonSolution.Name == "" || seenSolutions[commonSolution.Name] {
			continue
		}

		seenSolutions[commonSolution.Name] = true
		solutionNames = append(solutionNames, commonSolution.Name)
	}

	if len(solutionNames) == 0 {
		return "None"
	}

	sort.Strings(solutionNames)
	return strings.Join(solutionNames, ", ")
}
