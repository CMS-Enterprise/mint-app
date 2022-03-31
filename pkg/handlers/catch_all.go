package handlers

import (
	"github.com/cmsgov/mint-app/pkg/shared/apperrors"
	"net/http"
)

// NewCatchAllHandler is a constructor for CatchAllHanlder
func NewCatchAllHandler(base HandlerBase) CatchAllHandler {
	return CatchAllHandler{HandlerBase: base}
}

// CatchAllHandler returns 404
type CatchAllHandler struct {
	HandlerBase
}

// Handle returns 404 on unexpected routes
func (h CatchAllHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h.WriteErrorResponse(r.Context(), w, &apperrors.UnknownRouteError{Path: r.URL.Path})
	}
}
