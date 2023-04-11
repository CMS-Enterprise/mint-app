package models

// SearchRequest represents a request to Elasticsearch
type SearchRequest struct {
	Request map[string]interface{} `json:"request"`
}

// NewSearchRequest creates a new SearchRequest object from the given request map
func NewSearchRequest(request map[string]interface{}) *SearchRequest {
	return &SearchRequest{Request: request}
}
