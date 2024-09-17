package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
)

type invokeLambdaFunc func(cxt context.Context, html string) ([]byte, error)

// PDFHandler handles PDFs
type PDFHandler struct {
	HandlerBase
	invokeLambda invokeLambdaFunc
}

// NewPDFHandler returns a new PDFHandler
func NewPDFHandler(invoker invokeLambdaFunc) *PDFHandler {
	return &PDFHandler{invokeLambda: invoker}
}

type requestPayload struct {
	HTML []byte `json:"html"` // automatically decode base64
}

// Handle returns an http.HandlerFunc
func (h PDFHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		body, readErr := io.ReadAll(r.Body)
		if readErr != nil {
			h.WriteErrorResponse(r.Context(), w, readErr)
			return
		}

		var generateRequest requestPayload
		parseErr := json.Unmarshal(body, &generateRequest)
		if parseErr != nil {
			h.WriteErrorResponse(r.Context(), w, parseErr)
			return
		}

		result, generateErr := h.invokeLambda(r.Context(), string(generateRequest.HTML))
		if generateErr != nil {
			h.WriteErrorResponse(r.Context(), w, generateErr)
			return
		}

		if _, copyErr := io.Copy(w, bytes.NewReader(result)); copyErr != nil {
			h.WriteErrorResponse(r.Context(), w, copyErr)
			return
		}
	}
}
