package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/facebookgo/clock"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/apperrors"
)

// NewHandlerBase is a constructor for HandlerBase
func NewHandlerBase() HandlerBase {
	return HandlerBase{
		clock: clock.New(),
	}
}

// HandlerBase is for shared handler utilities
type HandlerBase struct {
	clock clock.Clock
}

type errorItem struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// errorResponse contains the structure of error for a http response
type errorResponse struct {
	Errors  []errorItem `json:"errors"`
	Code    int         `json:"code"`
	Message string      `json:"message"`
	TraceID uuid.UUID   `json:"traceID"`
}

func newErrorResponse(code int, message string, traceID uuid.UUID) errorResponse {
	return errorResponse{
		Errors:  []errorItem{},
		Code:    code,
		Message: message,
		TraceID: traceID,
	}
}

func (r *errorResponse) withMap(errMap map[string]string) {
	for k, v := range errMap {
		r.Errors = append(r.Errors, errorItem{
			Field:   k,
			Message: v,
		})
	}
}

func writeErrorResponse(w http.ResponseWriter, logger *zap.Logger, code int, response errorResponse) {
	responseBody, err := json.Marshal(response)
	if err != nil {
		logger.Error("Failed to marshal error response. Defaulting to generic.", zap.Error(err))
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_, err = w.Write(responseBody)
	if err != nil {
		logger.Error("Failed to write error response. Defaulting to generic.", zap.Error(err))
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
}

// WriteErrorResponse writes a response for a given application error
func (b HandlerBase) WriteErrorResponse(ctx context.Context, w http.ResponseWriter, appErr error) {
	logger := appcontext.ZLogger(ctx)

	traceID, ok := appcontext.Trace(ctx)
	if !ok {
		traceID = uuid.New()
		logger.With(zap.String("traceID", traceID.String()))
	}

	if unauthorizedErr, ok := errors.AsType[*apperrors.UnauthorizedError](appErr); ok {
		// 4XX errors are not logged as errors, but are for client
		logger.Info("Returning unauthorized response from handler", zap.Error(unauthorizedErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusUnauthorized,
			newErrorResponse(
				http.StatusUnauthorized,
				"Unauthorized",
				traceID,
			),
		)
		return
	}

	if queryErr, ok := errors.AsType[*apperrors.QueryError](appErr); ok {
		logger.Error("Returning server error response from handler", zap.Error(queryErr))
		if _, ok := errors.AsType[*apperrors.ResourceNotFoundError](queryErr.Unwrap()); ok {
			writeErrorResponse(
				w,
				logger,
				http.StatusNotFound,
				newErrorResponse(
					http.StatusNotFound,
					"Resource not found",
					traceID,
				),
			)
			return
		}

		writeErrorResponse(
			w,
			logger,
			http.StatusInternalServerError,
			newErrorResponse(
				http.StatusInternalServerError,
				"Something went wrong",
				traceID,
			),
		)
		return
	}

	if notificationErr, ok := errors.AsType[*apperrors.NotificationError](appErr); ok {
		logger.Error("Returning server error response from handler", zap.Error(notificationErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusInternalServerError,
			newErrorResponse(
				http.StatusInternalServerError,
				"Failed to send notification",
				traceID,
			),
		)
		return
	}

	if externalAPIErr, ok := errors.AsType[*apperrors.ExternalAPIError](appErr); ok {
		logger.Error("Returning service unavailable error response from handler", zap.Error(externalAPIErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusServiceUnavailable,
			newErrorResponse(
				http.StatusServiceUnavailable,
				"Service unavailable",
				traceID,
			),
		)
		return
	}

	if contextErr, ok := errors.AsType[*apperrors.ContextError](appErr); ok {
		logger.Error("Returning server error response from handler", zap.Error(contextErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusInternalServerError,
			newErrorResponse(
				http.StatusInternalServerError,
				"Something went wrong",
				traceID,
			),
		)
		return
	}

	if validationErr, ok := errors.AsType[*apperrors.ValidationError](appErr); ok {
		logger.Info("Returning unprocessable entity error from handler", zap.Error(validationErr))
		response := newErrorResponse(
			http.StatusUnprocessableEntity,
			"Entity unprocessable",
			traceID,
		)
		response.withMap(validationErr.Validations.Map())
		writeErrorResponse(w, logger, http.StatusUnprocessableEntity, response)
		return
	}

	if methodNotAllowedErr, ok := errors.AsType[*apperrors.MethodNotAllowedError](appErr); ok {
		logger.Info("Returning method not allowed error from handler", zap.Error(methodNotAllowedErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusMethodNotAllowed,
			newErrorResponse(
				http.StatusMethodNotAllowed,
				"Method not allowed",
				traceID,
			),
		)
		return
	}

	if resourceConflictErr, ok := errors.AsType[*apperrors.ResourceConflictError](appErr); ok {
		logger.Info("Returning resource conflict error from handler", zap.Error(resourceConflictErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusConflict,
			newErrorResponse(
				http.StatusConflict,
				"Resource conflict",
				traceID,
			),
		)
		return
	}

	if badRequestErr, ok := errors.AsType[*apperrors.BadRequestError](appErr); ok {
		logger.Info("Returning bad request error from handler", zap.Error(badRequestErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusBadRequest,
			newErrorResponse(
				http.StatusBadRequest,
				"Bad request",
				traceID,
			),
		)
		return
	}

	if unknownRouteErr, ok := errors.AsType[*apperrors.UnknownRouteError](appErr); ok {
		logger.Info("Returning status not found error from handler", zap.Error(unknownRouteErr))
		writeErrorResponse(
			w,
			logger,
			http.StatusNotFound,
			newErrorResponse(
				http.StatusNotFound,
				"Not found",
				traceID,
			),
		)
		return
	}

	if _, ok := errors.AsType[*apperrors.ResourceNotFoundError](appErr); ok {
		writeErrorResponse(
			w,
			logger,
			http.StatusNotFound,
			newErrorResponse(
				http.StatusNotFound,
				"Resource not found",
				traceID,
			),
		)
		return
	}

	logger.Error("Returning server error response from handler", zap.Error(appErr))
	writeErrorResponse(
		w,
		logger,
		http.StatusInternalServerError,
		newErrorResponse(
			http.StatusInternalServerError,
			"Something went wrong",
			traceID,
		),
	)
}
