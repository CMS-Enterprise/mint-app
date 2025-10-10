package resolvers

import (
	"context"
	"fmt"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOTemplateCategoryGetByTemplateIDLOADER implements resolver logic to get all MTO template categories by a template ID using a data loader
func MTOTemplateCategoryGetByTemplateIDLOADER(ctx context.Context, templateID uuid.UUID) ([]*models.MTOTemplateCategory, error) {
	return loaders.MTOTemplateCategory.ByTemplateID.Load(ctx, templateID)
}

// MTOTemplateMilestoneGetByTemplateIDLOADER implements resolver logic to get all MTO template milestones by a template ID using a data loader
func MTOTemplateMilestoneGetByTemplateIDLOADER(ctx context.Context, templateID uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	return loaders.MTOTemplateMilestone.ByTemplateID.Load(ctx, templateID)
}

// MTOTemplateSolutionGetByTemplateIDLOADER implements resolver logic to get all MTO template solutions by a template ID using a data loader
func MTOTemplateSolutionGetByTemplateIDLOADER(ctx context.Context, templateID uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	return loaders.MTOTemplateSolution.ByTemplateID.Load(ctx, templateID)
}

// MTOTemplateSubCategoryGetByCategoryIDLOADER implements resolver logic to get all MTO template subcategories by a category ID using a data loader
func MTOTemplateSubCategoryGetByCategoryIDLOADER(ctx context.Context, categoryID uuid.UUID) ([]*models.MTOTemplateSubCategory, error) {
	return loaders.MTOTemplateSubCategory.ByCategoryID.Load(ctx, categoryID)
}

// MTOTemplateSolutionGetByMilestoneIDLOADER implements resolver logic to get all MTO template solutions by a milestone ID using a data loader
func MTOTemplateSolutionGetByMilestoneIDLOADER(ctx context.Context, milestoneID uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	return loaders.MTOTemplateSolution.ByMilestoneID.Load(ctx, milestoneID)
}

// MTOTemplateMilestoneGetByCategoryIDLOADER implements resolver logic to get all MTO template milestones by a category ID using a data loader
func MTOTemplateMilestoneGetByCategoryIDLOADER(ctx context.Context, categoryID uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	return loaders.MTOTemplateMilestone.ByCategoryID.Load(ctx, categoryID)
}

// MTOTemplateGetByKeysLOADER implements resolver logic to get all MTO templates, optionally filtered by keys using a data loader
func MTOTemplateGetByKeysLOADER(ctx context.Context, keys []models.MTOTemplateKey) ([]*models.MTOTemplate, error) {
	if len(keys) == 0 {
		keys = models.AllMTOTemplateKeys
	}

	// Keys provided, filter by those keys
	var templates []*models.MTOTemplate
	for _, key := range keys {
		template, err := loaders.MTOTemplate.ByKey.Load(ctx, key)
		if err != nil {
			return nil, err
		}
		if template != nil {
			templates = append(templates, template)
		}
	}
	return templates, nil
}

// MTOTemplateGetByIDOrKeyLOADER implements resolver logic to get a single MTO template by ID or key using a data loader
func MTOTemplateGetByIDOrKeyLOADER(ctx context.Context, id *uuid.UUID, key *models.MTOTemplateKey) (*models.MTOTemplate, error) {
	if id != nil {
		return loaders.MTOTemplate.ByID.Load(ctx, *id)
	}
	if key != nil {
		return loaders.MTOTemplate.ByKey.Load(ctx, *key)
	}
	return nil, fmt.Errorf("either id or key must be provided")
}

// MTOTemplateMilestoneGetBySolutionIDLOADER implements resolver logic to get all MTO template milestones by a solution ID using a data loader
func MTOTemplateMilestoneGetBySolutionIDLOADER(ctx context.Context, solutionID uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	return loaders.MTOTemplateMilestone.BySolutionID.Load(ctx, solutionID)
}

// --- types & deps ---
type ApplyTemplateDeps struct {
	Store                *storage.Store
	Logger               *zap.Logger
	EmailService         oddmail.EmailService
	EmailTemplateService email.TemplateService
	AddressBook          email.AddressBook
}

type ApplyTemplateArgs struct {
	Ctx         context.Context
	Principal   authentication.Principal
	ModelPlanID uuid.UUID
	TemplateID  uuid.UUID
}

type TemplateBundle struct {
	Categories             []*models.MTOTemplateCategory
	Milestones             []*models.MTOTemplateMilestone
	Solutions              []*models.MTOTemplateSolution
	MilestoneSolutionLinks []*models.MTOTemplateMilestoneSolutionLink
}

type ApplyCounts struct {
	Categories int
	Milestones int
	Solutions  int
}

type WarningSink []string

func (w *WarningSink) Add(msg string) { *w = append(*w, msg) }

// --- orchestrator ---

func ApplyTemplateToMTO(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	templateID uuid.UUID,
) (*model.ApplyTemplateResult, error) {

	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	deps := ApplyTemplateDeps{
		Store:                store,
		Logger:               logger,
		EmailService:         emailService,
		EmailTemplateService: emailTemplateService,
		AddressBook:          addressBook,
	}
	args := ApplyTemplateArgs{
		Ctx:         ctx,
		Principal:   principal,
		ModelPlanID: modelPlanID,
		TemplateID:  templateID,
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*model.ApplyTemplateResult, error) {
		return applyTemplateTx(tx, deps, args)
	})
}

// --- transactional core ---

func applyTemplateTx(
	tx *sqlx.Tx,
	deps ApplyTemplateDeps,
	args ApplyTemplateArgs,
) (*model.ApplyTemplateResult, error) {
	var warnings WarningSink
	var counts ApplyCounts

	principalAccount := args.Principal.Account()

	// 1) Load bundle
	bundle, err := loadTemplateBundle(args.Ctx, args.TemplateID)
	if err != nil {
		return nil, err
	}

	// 2) Categories
	categoryIDMap, categoriesCreated, categoryWarnings := copyCategories(tx, deps.Logger, bundle.Categories, args.ModelPlanID, principalAccount.ID)
	counts.Categories += categoriesCreated
	warnings = append(warnings, categoryWarnings...)

	// 3) Solutions
	solutionIDKeyMap, solutionCreatedCount, solutionWarnings := insertSolutions(tx, deps.Logger, bundle.Solutions, args.ModelPlanID, principalAccount.ID)
	counts.Solutions += solutionCreatedCount
	warnings = append(warnings, solutionWarnings...)

	// 4) Milestones
	milestonesCreated, milestoneWarnings := copyMilestones(
		tx, deps, args,
		bundle.Milestones,
		bundle.MilestoneSolutionLinks,
		categoryIDMap, solutionIDKeyMap,
	)
	counts.Milestones += milestonesCreated
	warnings = append(warnings, milestoneWarnings...)

	// 5) Link template
	if err := upsertTemplateLink(tx, deps.Logger, principalAccount.ID, args.ModelPlanID, args.TemplateID); err != nil {
		return nil, fmt.Errorf("failed to create template link: %w", err)
	}

	return &model.ApplyTemplateResult{
		ID:              args.TemplateID,
		ModelPlanID:     args.ModelPlanID,
		TemplateID:      args.TemplateID,
		CategoriesAdded: counts.Categories,
		MilestonesAdded: counts.Milestones,
		SolutionsAdded:  counts.Solutions,
		Warnings:        warnings,
	}, nil
}

// --- phase helpers ---

func loadTemplateBundle(ctx context.Context, templateID uuid.UUID) (*TemplateBundle, error) {
	categories, err := loaders.MTOTemplateCategory.ByTemplateID.Load(ctx, templateID)
	if err != nil {
		return nil, fmt.Errorf("get template categories: %w", err)
	}

	milestones, err := loaders.MTOTemplateMilestone.ByTemplateID.Load(ctx, templateID)
	if err != nil {
		return nil, fmt.Errorf("get template milestones: %w", err)
	}

	solutions, err := loaders.MTOTemplateSolution.ByTemplateID.Load(ctx, templateID)
	if err != nil {
		return nil, fmt.Errorf("get template solutions: %w", err)
	}

	links, err := loaders.MTOTemplateMilestoneSolutionLink.ByTemplateID.Load(ctx, templateID)
	if err != nil {
		return nil, fmt.Errorf("get milestone-solution links: %w", err)
	}

	// Keep deterministic category order
	sort.Slice(categories, func(i, j int) bool { return categories[i].Order < categories[j].Order })

	return &TemplateBundle{
		Categories:             categories,
		Milestones:             milestones,
		Solutions:              solutions,
		MilestoneSolutionLinks: links,
	}, nil
}

func copyCategories(
	tx *sqlx.Tx,
	logger *zap.Logger,
	categories []*models.MTOTemplateCategory,
	modelPlanID, actor uuid.UUID,
) (map[uuid.UUID]uuid.UUID, int, WarningSink) {

	var warnings WarningSink
	created := 0
	categoryIDMap := make(map[uuid.UUID]uuid.UUID)

	for _, category := range categories {
		var parentID *uuid.UUID
		if category.ParentID != nil {
			if mapped, ok := categoryIDMap[*category.ParentID]; ok {
				parentID = &mapped
			} else {
				warnings.Add(fmt.Sprintf("category %s references unknown parent ID %s", category.Name, *category.ParentID))
				continue
			}
		}

		newCategory := models.NewMTOCategory(actor, category.Name, modelPlanID, parentID, category.Order)
		added, err := storage.MTOCategoryCreateAllowConflicts(tx, logger, newCategory)
		if err != nil {
			return nil, created, append(warnings, fmt.Sprintf("create MTO category %s: %v", category.Name, err))
		}
		categoryIDMap[category.ID] = added.ID
		if added.NewlyInserted {
			created++
		}
	}
	return categoryIDMap, created, warnings
}

func insertSolutions(
	tx *sqlx.Tx,
	logger *zap.Logger,
	solutions []*models.MTOTemplateSolution,
	modelPlanID, actor uuid.UUID,
) (map[uuid.UUID]models.MTOCommonSolutionKey, int, WarningSink) {

	var warnings WarningSink
	solutionIDKeyMap := make(map[uuid.UUID]models.MTOCommonSolutionKey)
	toInsert := make([]models.MTOCommonSolutionKey, 0, len(solutions))

	for _, s := range solutions {
		solutionIDKeyMap[s.ID] = s.Key
		toInsert = append(toInsert, s.Key)
	}

	inserted, err := storage.MTOSolutionCreateCommonAllowConflictsSQL(tx, logger, toInsert, modelPlanID, actor)
	if err != nil {
		warnings.Add(fmt.Sprintf("failed to create MTO solutions %v", err))
		return solutionIDKeyMap, 0, warnings
	}

	created := 0
	for _, status := range inserted {
		if status.NewlyInserted {
			created++
		}
	}
	return solutionIDKeyMap, created, warnings
}

func copyMilestones(
	tx *sqlx.Tx,
	deps ApplyTemplateDeps,
	args ApplyTemplateArgs,
	milestones []*models.MTOTemplateMilestone,
	links []*models.MTOTemplateMilestoneSolutionLink,
	categoryIDMap map[uuid.UUID]uuid.UUID,
	solutionIDKeyMap map[uuid.UUID]models.MTOCommonSolutionKey,
) (int, WarningSink) {

	var warnings WarningSink
	created := 0
	pacct := args.Principal.Account()

	for _, ms := range milestones {
		solutionKeys := associatedSolutionKeysForMilestone(ms.ID, links, solutionIDKeyMap, &warnings)

		msWithStatus, err := MTOMilestoneCreateCommonWithTXAllowConflicts(
			args.Ctx, deps.Logger, args.Principal, tx, deps.Store,
			deps.EmailService, deps.EmailTemplateService, deps.AddressBook,
			args.ModelPlanID, ms.Key, solutionKeys,
		)
		if err != nil {
			warnings.Add(fmt.Sprintf("failed to create MTO milestone %s: %v", ms.Name, err))
			continue
		}

		// Category linkage (if present)
		if ms.MTOTemplateCategoryID != nil {
			if newCategoryID, ok := categoryIDMap[*ms.MTOTemplateCategoryID]; ok {
				msWithStatus.MTOCategoryID = &newCategoryID
				msWithStatus.Name = nil // common milestone => enforce constraint
				msWithStatus.ModifiedBy = &pacct.ID

				if _, err := storage.MTOMilestoneUpdate(tx, deps.Logger, &msWithStatus.MTOMilestone); err != nil {
					warnings.Add(fmt.Sprintf("failed to update milestone %s with new category ID: %v", ms.Name, err))
				}
			} else {
				warnings.Add(fmt.Sprintf("milestone %s references unknown category ID %s", ms.ID, *ms.MTOTemplateCategoryID))
			}
		}

		if msWithStatus.NewlyInserted {
			created++
		}
	}
	return created, warnings
}

func associatedSolutionKeysForMilestone(
	milestoneID uuid.UUID,
	links []*models.MTOTemplateMilestoneSolutionLink,
	solutionIDKeyMap map[uuid.UUID]models.MTOCommonSolutionKey,
	warnings *WarningSink,
) []models.MTOCommonSolutionKey {
	var keys []models.MTOCommonSolutionKey
	for _, l := range links {
		if l.TemplateMilestoneID == milestoneID {
			if k, ok := solutionIDKeyMap[l.TemplateSolutionID]; ok {
				keys = append(keys, k)
			} else if warnings != nil {
				warnings.Add(fmt.Sprintf("solution ID %s linked to milestone ID %s not found", l.TemplateSolutionID, milestoneID))
			}
		}
	}
	return keys
}

func upsertTemplateLink(tx *sqlx.Tx, logger *zap.Logger, actor, modelPlanID, templateID uuid.UUID) error {
	link := models.NewModelPlanMTOTemplateLink(actor, modelPlanID, templateID, time.Now(), true)
	_, err := storage.ModelPlanMTOTemplateLinkUpsert(tx, logger, link)
	return err
}
