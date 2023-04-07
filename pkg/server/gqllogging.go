package server

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/apperrors"
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

		vars := requestContext.Variables

		errored := len(errorList) > 0
		fields := []zap.Field{
			zap.String("operation", requestContext.OperationName),
			zap.Duration("duration", duration),
			zap.Bool("error", errored),
			zap.Any("variables", vars), // TODO: Review if this should be logged here... Maybe we should handle elsewhere?
		}

		if complexityStats != nil {
			fields = append(fields, zap.Int("complexity", complexityStats.Complexity))
		}
		//TODO, try to extract these errors, and if possible handle individually?
		typedErrorList := TypedErrorList(&errorList)
		for _, tErr := range typedErrorList {

			fields = append(fields, zap.Any("errorCode", tErr.Code()))

		}

		if errored {
			//TODO: should we just append the TypedError List instead of manually extracting an error code? That would contain the mesage and the code etc
			fields = append(fields, zap.Any("errorList", errorList), zap.String("query", requestContext.RawQuery))
		}
		if errored {
			// TODO: can we type errors so we can igore them
			// logger.Error("graphql query", fields...)
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

		//TODO: cast to interface, try cast to typed error to get underlying type? Perhaps treat this differently?
		err := gqlError.Unwrap()
		typedError, isTypedError := err.(apperrors.ITypedError)
		if isTypedError {
			typedErrorList = append(typedErrorList, typedError)
		}

	}

	return typedErrorList

}
