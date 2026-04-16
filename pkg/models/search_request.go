package models

// SearchRequest represents a request to Elasticsearch
type SearchRequest struct {
	Query map[string]any `json:"query"`
}

// NewSearchRequest creates a new SearchRequest object from the given request map
func NewSearchRequest(query map[string]any) *SearchRequest {
	return &SearchRequest{Query: query}
}
