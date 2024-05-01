package worker

import (
	"context"
	"fmt"
	"strconv"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

// TranslateAuditJob is the job to translate an individual audit into an analyzed audit, and note that the translation is done in the processing table
// args[0] the id of the audit (int)
// Changes: (Job) fill out the param specs. Should this be the id of the processing queue instead?
func (w *Worker) TranslateAuditJob(ctx context.Context, args ...interface{}) (returnedError error) {
	// Changes: (Job) add a recover function to each job in case there is an issue
	// defer apperrors.RecoverPanicAsErrorFunction(&returnedError)
	// fmt.Printf("translating audit job reached. Args %v", args)
	w.Logger.Info("translating job reached.", zap.Any("args", args))
	if len(args) < 2 {
		return fmt.Errorf("no arguments were provided for this translateAuditJob")
	}

	// Changes: (Job) remove the early return, this is for troubleshooting only
	// return fmt.Errorf("I've done this error to test errors")
	// return nil

	// var auditID int

	arg1String := fmt.Sprint(args[0])
	// arg1String, isString := args[0].(string)
	auditID, err := strconv.Atoi(arg1String)
	if err != nil {
		return fmt.Errorf("unable to convert argument  ( %v )to an int as expected for auditID for the translate audit job. Err %w", args[0], err)
	}

	arg2String := fmt.Sprint(args[1])
	queueID, err := uuid.Parse(arg2String)
	if err != nil {
		return fmt.Errorf("unable to convert argument  ( %v )to an uuid as expected for translated_audit_queue_id for the translate audit job. Err %w", args[1], err)
	}
	// fmt.Printf("translating audit %v, queueID %v", auditID, queueID)
	w.Logger.Debug("translating audit", zap.Any("auditID", auditID), zap.Any("queueID", queueID))

	translationErr := translatedaudit.TranslateAuditJobByID(ctx, w.Store, w.Logger, auditID, queueID)
	if translationErr != nil {
		return translationErr
	}

	return returnedError
}
