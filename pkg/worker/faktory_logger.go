package worker

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/logging"
)

type FaktoryLogger struct {
	logging.ZapLogger
	jobInfo
}
type jobInfo struct {
	JobID      string
	JobType    string
	BatchID    *string
	RetryCount int
	// The maximum number of retries allowed for this job
	// it includes the first attempt, so if MaxRetries is 2, the job will be attempted 2 times total.
	//  Retry Count starts at 0, so retry 1 means the job is on its final attempt
	MaxRetries   int
	FaktoryQueue string
}

func (l *FaktoryLogger) IsFinalAttempt() bool {
	//
	return l.RetryCount >= (l.MaxRetries - 1)
}

// DecorateWithJobInfo adds faktory job info fields to the logger
// Its intended to be used in the initial wrapper stage
func (l *FaktoryLogger) DecorateWithJobInfo() *FaktoryLogger {

	fields := faktoryFields(l.JobID, l.JobType, l.BatchID,
		logfields.RetryCount(l.RetryCount),
		logfields.MaxRetries(l.MaxRetries),
		logfields.IsFinalAttempt(l.IsFinalAttempt()),
		logfields.FaktoryQueue(l.FaktoryQueue),
	)
	l.Logger = l.Logger.With(fields...)
	return l
}

// NewFaktoryLogger creates a new FaktoryLogger from a zap.Logger
func NewFaktoryLogger(logger *zap.Logger) *FaktoryLogger {
	return &FaktoryLogger{
		ZapLogger: *logging.NewZapLogger(logger),
	}
}

// ShouldError returns true if the job is on its final attempt
// if not, it returns false
func (l *FaktoryLogger) ShouldError() bool {
	return l.IsFinalAttempt()
}

func (l *FaktoryLogger) Named(s string) *FaktoryLogger {
	l.Logger = l.Logger.Named(s)
	return l
}

func (l *FaktoryLogger) WithOptions(opts ...zap.Option) *FaktoryLogger {
	l.Logger = l.Logger.WithOptions(opts...)
	return l
}

func (l *FaktoryLogger) With(fields ...zap.Field) *FaktoryLogger {
	l.Logger = l.Logger.With(fields...)
	return l
}

func (l *FaktoryLogger) ErrorOrWarn(msg string, fields ...zap.Field) {
	if l.ShouldError() {
		l.Error(msg, fields...)
	} else {
		l.Warn(msg, fields...)
	}
}

// Interface compliance checks
var _ logging.ILogger = (*FaktoryLogger)(nil)
var _ logging.ChainableLogger[*FaktoryLogger] = (*FaktoryLogger)(nil)
var _ logging.ErrorOrWarnLogger = (*FaktoryLogger)(nil)
var _ logging.ChainableErrorOrWarnLogger[*FaktoryLogger] = (*FaktoryLogger)(nil)
