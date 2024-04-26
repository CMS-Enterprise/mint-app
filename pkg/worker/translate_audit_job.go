package worker

import (
	"context"
	"fmt"
	"strconv"

	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

// TranslateAuditJob is the job to translate an individual audit into an analyzed audit, and note that the translation is done in the processing table
// args[0] the id of the audit (int)
// Changes: (Job) fill out the param specs. Should this be the id of the processing queue instead?
func (w *Worker) TranslateAuditJob(ctx context.Context, args ...interface{}) error {

	if len(args) < 1 {
		return fmt.Errorf("no arguments were provided for this translateAuditJob")
	}

	auditID, err := strconv.Atoi(args[0].(string))
	if err != nil {
		return fmt.Errorf("unable to convert argument  ( %v )to an int as expected for auditID for the translate audit job. Err %w", args[0], err)
	}
	_, translateErr := translatedaudit.TranslateAudit(ctx, w.Store, w.Logger, auditID)
	if translateErr != nil {
		return fmt.Errorf("error translating audit for audit id %v. Err %w", auditID, translateErr)
	}
	return nil
}
