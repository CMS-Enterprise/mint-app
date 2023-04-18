package resolvers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/opensearch-project/opensearch-go/v2"
	"github.com/opensearch-project/opensearch-go/v2/opensearchapi"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

// Marshal and perform queries
func marshalSearchQuery(request models.SearchRequest) (io.Reader, error) {
	requestBody, err := json.Marshal(request.Query)
	if err != nil {
		return nil, fmt.Errorf("error marshaling request body: %s", err)
	}
	return bytes.NewReader(requestBody), nil
}

func performSearch(
	searchClient *opensearch.Client,
	queryReader io.Reader,
	limit int,
	offset int,
	sortBy string,
) (*opensearchapi.Response, error) {
	return searchClient.Search(
		searchClient.Search.WithIndex("change_table_idx"),
		searchClient.Search.WithBody(queryReader),
		searchClient.Search.WithSort(sortBy),
		searchClient.Search.WithSize(limit),
		searchClient.Search.WithFrom(offset),
		searchClient.Search.WithTrackTotalHits(true),
		searchClient.Search.WithPretty(),
	)
}

// Handle search errors and parse response
func handleSearchError(res *opensearchapi.Response, logger *zap.Logger) error {
	var e map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&e); err != nil {
		logger.Error("Error parsing the response body", zap.Error(err))
		return fmt.Errorf("error parsing the response body: %s", err)
	}

	logger.Error(
		"Error searching change table",
		zap.String("status", res.Status()),
		zap.String("type", e["error"].(map[string]interface{})["type"].(string)),
		zap.String("reason", e["error"].(map[string]interface{})["reason"].(string)),
		zap.Reflect("error_details", e),
	)
	return fmt.Errorf("error searching change table: %s", e["error"].(map[string]interface{})["reason"])
}

func parseSearchResponseBody(res *opensearchapi.Response, logger *zap.Logger) (map[string]interface{}, error) {
	var r map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
		logger.Error("Error parsing the response body", zap.Error(err))
		return nil, fmt.Errorf("error parsing the response body: %s", err)
	}
	return r, nil
}

// Extract change table records from search response
func extractChangeTableRecords(
	r map[string]interface{},
	logger *zap.Logger,
) ([]*models.ChangeTableRecord, error) {
	changeTableRecords := make([]*models.ChangeTableRecord, 0)
	hits := r["hits"].(map[string]interface{})["hits"].([]interface{})

	for _, hit := range hits {
		source := hit.(map[string]interface{})["_source"].(map[string]interface{})
		sourceBytes, err := json.Marshal(source)
		if err != nil {
			logger.Error("Error marshaling source into JSON", zap.Error(err))
			return nil, fmt.Errorf("error marshaling source into JSON: %s", err)
		}

		var record models.ChangeTableRecord
		if err := json.Unmarshal(sourceBytes, &record); err != nil {
			logger.Error("Error unmarshalling JSON into ChangeTableRecord", zap.Error(err))
			return nil, fmt.Errorf("error unmarshaling JSON into ChangeTableRecord: %s", err)
		}

		changeTableRecords = append(changeTableRecords, &record)
	}
	return changeTableRecords, nil
}

// Search functions for change table
func searchChangeTableBase(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	request models.SearchRequest,
	limit int,
	offset int,
	sortBy string,
) ([]*models.ChangeTableRecord, error) {
	queryReader, err := marshalSearchQuery(request)
	if err != nil {
		return nil, err
	}

	res, err := performSearch(searchClient, queryReader, limit, offset, sortBy)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err2 := Body.Close()
		if err2 != nil {
			logger.Error("Error closing response body", zap.Error(err2))
		}
	}(res.Body)

	if res.IsError() {
		return nil, handleSearchError(res, logger)
	}

	r, err := parseSearchResponseBody(res, logger)
	if err != nil {
		return nil, err
	}

	changeTableRecords, err := extractChangeTableRecords(r, logger)
	if err != nil {
		return nil, err
	}

	return changeTableRecords, nil
}

// SearchChangeTable searches the change table for records matching the given query
func SearchChangeTable(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	request models.SearchRequest,
	limit int,
	offset int,
	sortBy string,
) ([]*models.ChangeTableRecord, error) {
	return searchChangeTableBase(logger, searchClient, request, limit, offset, sortBy)
}

// SearchChangeTableWithFreeText searches for change table records in search using a free-text search
func SearchChangeTableWithFreeText(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	searchText string,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	request := models.SearchRequest{
		Query: map[string]interface{}{
			"query": map[string]interface{}{
				"multi_match": map[string]interface{}{
					"query":         searchText,
					"fuzziness":     "AUTO",
					"prefix_length": 1,
				},
			},
		},
	}
	return searchChangeTableBase(logger, searchClient, request, limit, offset, "_score:desc")
}

// SearchChangeTableByModelPlanID searches the change table for records matching the given model plan ID
func SearchChangeTableByModelPlanID(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	modelPlanID uuid.UUID,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := models.SearchRequest{
		Query: map[string]interface{}{
			"query": map[string]interface{}{
				"bool": map[string]interface{}{
					"filter": []interface{}{
						map[string]interface{}{
							"term": map[string]interface{}{
								"table_id": "1",
							},
						},
						map[string]interface{}{
							"term": map[string]interface{}{
								"primary_key.keyword": modelPlanID.String(),
							},
						},
					},
				},
			},
		},
	}

	return searchChangeTableBase(logger, searchClient, query, limit, offset, "modified_dts:desc")
}

// SearchChangeTableByDateRange searches the change table for records with a modified_dts within the specified date range
func SearchChangeTableByDateRange(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	startDate time.Time,
	endDate time.Time,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	request := models.SearchRequest{
		Query: map[string]interface{}{
			"query": map[string]interface{}{
				"bool": map[string]interface{}{
					"filter": []interface{}{
						map[string]interface{}{
							"range": map[string]interface{}{
								"modified_dts": map[string]interface{}{
									"gte": startDate.Format(time.RFC3339),
									"lte": endDate.Format(time.RFC3339),
								},
							},
						},
					},
				},
			},
		},
	}

	return searchChangeTableBase(logger, searchClient, request, limit, offset, "modified_dts:desc")
}

// SearchChangeTableByActor searches the change table for records with a modified_by field matching the given actor
func SearchChangeTableByActor(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	actor string,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := models.SearchRequest{
		Query: map[string]interface{}{
			"query": map[string]interface{}{
				"multi_match": map[string]interface{}{
					"query":         actor,
					"fuzziness":     "AUTO",
					"prefix_length": 1,
					"fields": []string{
						"modified_by.common_name",
						"modified_by.username",
						"modified_by.given_name",
						"modified_by.family_name",
					},
				},
			},
		},
	}

	return searchChangeTableBase(logger, searchClient, query, limit, offset, "_score:desc")
}

// SearchChangeTableByModelStatus searches the change table for records with a
// status field matching the given model plan status
func SearchChangeTableByModelStatus(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	status models.ModelStatus,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := models.SearchRequest{
		Query: map[string]interface{}{
			"query": map[string]interface{}{
				"bool": map[string]interface{}{
					"should": []interface{}{
						map[string]interface{}{
							"term": map[string]interface{}{
								"fields.status.new.keyword": status,
							},
						},
						map[string]interface{}{
							"term": map[string]interface{}{
								"fields.status.old.keyword": status,
							},
						},
					},
					"minimum_should_match": 1,
					"filter": map[string]interface{}{
						"term": map[string]interface{}{
							"table_id": 1,
						},
					},
				},
			},
		},
	}

	return searchChangeTableBase(logger, searchClient, query, limit, offset, "modified_dts:desc")
}
