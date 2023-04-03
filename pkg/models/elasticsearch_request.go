package models

// ElasticsearchRequest represents a request to Elasticsearch
type ElasticsearchRequest struct {
	Request map[string]interface{} `json:"request"`
}

// NewElasticsearchRequest creates a new ElasticsearchRequest object from the given request map
func NewElasticsearchRequest(request map[string]interface{}) *ElasticsearchRequest {
	return &ElasticsearchRequest{Request: request}
}
