package models

// SearchRequest represents a request to Elasticsearch
type SearchRequest struct {
	Query map[string]interface{} `json:"query"`
}

// NewSearchRequest creates a new SearchRequest object from the given request map
func NewSearchRequest(query map[string]interface{}) *SearchRequest {
	return &SearchRequest{Query: query}
}
