package server

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/apperrors"
)

// NewGQLResponseMiddleware returns a handler with a request based logger
func NewGQLResponseMiddleware() graphql.ResponseMiddleware {
	return func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		logger := appcontext.ZLogger(ctx)
		result := next(ctx)

		requestContext := graphql.GetOperationContext(ctx)
		errorList := graphql.GetErrors(ctx)

		duration := time.Since(requestContext.Stats.OperationStart)
		complexityStats := extension.GetComplexityStats(ctx)

		errored := len(errorList) > 0
		fields := []zap.Field{
			zap.String("operation", requestContext.OperationName),
			zap.Duration("duration", duration),
			zap.Bool("error", errored),
		}

		if complexityStats != nil {
			fields = append(fields, zap.Int("complexity", complexityStats.Complexity))
		}

		if errored {
			typedErrorList := TypedErrorList(&errorList)
			errCodes := []apperrors.ErrorCode{}
			for _, tErr := range typedErrorList {
				errCodes = append(errCodes, tErr.Code())
			}
			fields = append(fields, zap.Any("errorCodes", errCodes))
			fields = append(
				fields, zap.Any("errorList", errorList),
				zap.String("query", requestContext.RawQuery),
			)

			logger.Warn("graphql query returned error", fields...)
		} else {
			logger.Info("graphql query", fields...)
		}

		return result
	}
}

// TypedErrorList casts a list of gqlErrors to Typed Error, so error code can be extracted.
func TypedErrorList(List *gqlerror.List) []apperrors.ITypedError {
	typedErrorList := []apperrors.ITypedError{}
	for _, gqlError := range *List {
		err := gqlError.Unwrap()
		typedError, isTypedError := err.(apperrors.ITypedError)
		if isTypedError {
			typedErrorList = append(typedErrorList, typedError)
			// TODO: potenially write the gql.Error extension to provide more information
		}

	}

	return typedErrorList

}
