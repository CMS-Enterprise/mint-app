package services

import (
	"context"
	"errors"
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewBackfill imports historical data into EASi
func NewBackfill(
	config Config,
	fetchIntake func(ctx context.Context, id uuid.UUID) (*models.SystemIntake, error),
	fetchIntakeByLifecycleID func(ctx context.Context, lcid string) (*models.SystemIntake, error),
	createIntake func(c context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	updateIntake func(ctx context.Context, intake *models.SystemIntake) (*models.SystemIntake, error),
	createNote func(c context.Context, note *models.Note) (*models.Note, error),
	authorize func(context.Context) (bool, error),
) func(context.Context, models.SystemIntake, []models.Note) (bool, error) {
	return func(ctx context.Context, intake models.SystemIntake, notes []models.Note) (bool, error) {
		if intake.LifecycleID.ValueOrZero() == "" {
			return false, &apperrors.BadRequestError{
				Err: errors.New("lifecycle ID is required"),
			}
		}

		ok, err := authorize(ctx)
		if err != nil {
			return false, err
		}

		fmt.Printf("%+v", intake.LifecycleID)

		if !ok {
			return false, &apperrors.ResourceNotFoundError{
				Err:      errors.New("failed to authorize backfill creation"),
				Resource: models.Note{},
			}
		}

		existingRecord, existingErr := fetchIntakeByLifecycleID(ctx, intake.LifecycleID.String)
		if existingErr != nil {
			return false, &apperrors.QueryError{
				Err: existingErr,
			}
		}

		if existingRecord != nil {
			appcontext.ZLogger(ctx).Info("updating existing system intake", zap.String("lcid", intake.LifecycleID.String))
			intake.RequestType = models.SystemIntakeRequestTypeNEW
			intake.Status = models.SystemIntakeStatusLCIDISSUED
			intake.ID = existingRecord.ID
			if _, updateErr := updateIntake(ctx, &intake); updateErr != nil {
				return false, err
			}
			return false, nil
		}

		appcontext.ZLogger(ctx).Info("creating new system intake", zap.String("lcid", intake.LifecycleID.String))
		intake.RequestType = models.SystemIntakeRequestTypeNEW
		intake.Status = models.SystemIntakeStatusLCIDISSUED

		// If no ID is provided, generate a new V3 UUID using the lifecycle ID. This will always result in
		// the same UUID being generated when given the same input.
		if intake.ID == uuid.Nil {
			appcontext.ZLogger(ctx).Info("generating a new ID for lcid", zap.String("lcid", intake.LifecycleID.String))
			intake.ID = uuid.NewMD5(uuid.NameSpaceOID, []byte(intake.LifecycleID.String))
		}

		createdIntake, createErr := createIntake(ctx, &intake)
		if createErr != nil {
			return false, err
		}

		if intake.LifecycleID.ValueOrZero() != "" {
			createdIntake.LifecycleID = intake.LifecycleID
		}
		if intake.LifecycleExpiresAt != nil {
			createdIntake.LifecycleExpiresAt = intake.LifecycleExpiresAt
		}
		if intake.LifecycleScope.ValueOrZero() != "" {
			createdIntake.LifecycleScope = intake.LifecycleScope
		}
		if intake.SubmittedAt != nil {
			createdIntake.SubmittedAt = intake.SubmittedAt
		}
		createdIntake.AdminLead = intake.AdminLead

		if _, err = updateIntake(ctx, createdIntake); err != nil {
			return false, err
		}

		for _, note := range notes {
			note.SystemIntakeID = intake.ID
			note.AuthorEUAID = appcontext.Principal(ctx).ID()

			n := note
			if _, err = createNote(ctx, &n); err != nil {
				return false, err
			}
		}
		appcontext.ZLogger(ctx).Info("created backfill document", zap.String("intakeID", intake.ID.String()))
		return true, nil
	}
}
