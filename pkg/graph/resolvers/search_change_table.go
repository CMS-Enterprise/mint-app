package resolvers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/google/uuid"

	"github.com/elastic/go-elasticsearch/v8/esapi"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func marshalElasticsearchQuery(query model.ElasticsearchQuery) (io.Reader, error) {
	queryBody, err := json.Marshal(query)
	if err != nil {
		return nil, fmt.Errorf("error marshaling query body: %s", err)
	}
	return bytes.NewReader(queryBody), nil
}

func performSearch(
	esClient *elasticsearch.Client,
	queryReader io.Reader,
	limit int,
	offset int,
	sortBy string,
) (*esapi.Response, error) {
	return esClient.Search(
		esClient.Search.WithIndex("change_table_idx"),
		esClient.Search.WithBody(queryReader),
		esClient.Search.WithSort(sortBy),
		esClient.Search.WithSize(limit),
		esClient.Search.WithFrom(offset),
		esClient.Search.WithTrackTotalHits(true),
		esClient.Search.WithPretty(),
	)
}

func handleElasticsearchError(res *esapi.Response, logger *zap.Logger) error {
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

func parseElasticsearchResponseBody(res *esapi.Response, logger *zap.Logger) (map[string]interface{}, error) {
	var r map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
		logger.Error("Error parsing the response body", zap.Error(err))
		return nil, fmt.Errorf("error parsing the response body: %s", err)
	}
	return r, nil
}

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

// SearchChangeTable searches the change table for records matching the given query
func SearchChangeTable(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	query model.ElasticsearchQuery,
	limit int,
	offset int,
	sortBy string,
) ([]*models.ChangeTableRecord, error) {

	queryReader, err := marshalElasticsearchQuery(query)
	if err != nil {
		return nil, err
	}

	res, err := performSearch(esClient, queryReader, limit, offset, sortBy)
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
		return nil, handleElasticsearchError(res, logger)
	}

	r, err := parseElasticsearchResponseBody(res, logger)
	if err != nil {
		return nil, err
	}

	changeTableRecords, err := extractChangeTableRecords(r, logger)
	if err != nil {
		return nil, err
	}

	return changeTableRecords, nil
}

// SearchChangeTableWithFreeText searches for change table records in Elasticsearch using a free-text search
func SearchChangeTableWithFreeText(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	searchText string,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := model.ElasticsearchQuery{
		Query: map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":         searchText,
				"fuzziness":     "AUTO",
				"prefix_length": 1,
			},
		},
	}

	return SearchChangeTable(logger, esClient, query, limit, offset, "_score:desc")
}

// SearchChangeTableByModelPlanID searches the change table for records matching the given model plan ID
func SearchChangeTableByModelPlanID(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	modelPlanID uuid.UUID,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := model.ElasticsearchQuery{
		Query: map[string]interface{}{
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
	}

	return SearchChangeTable(logger, esClient, query, limit, offset, "modified_dts:desc")
}

// SearchChangeTableByDateRange searches the change table for records with a modified_dts within the specified date range
func SearchChangeTableByDateRange(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	startDate time.Time,
	endDate time.Time,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := model.ElasticsearchQuery{
		Query: map[string]interface{}{
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
	}

	return SearchChangeTable(logger, esClient, query, limit, offset, "modified_dts:desc")
}

// SearchChangeTableByActor searches the change table for records with a modified_by field matching the given actor
func SearchChangeTableByActor(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	actor string,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := model.ElasticsearchQuery{
		Query: map[string]interface{}{
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
	}

	return SearchChangeTable(logger, esClient, query, limit, offset, "_score:desc")
}

// SearchChangeTableByModelStatus searches the change table for records with a
// status field matching the given model plan status
func SearchChangeTableByModelStatus(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	status models.ModelStatus,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query := model.ElasticsearchQuery{
		Query: map[string]interface{}{
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
	}

	return SearchChangeTable(logger, esClient, query, limit, offset, "modified_dts:desc")
}

func SearchChangeTableDateHistogramConsolidatedAggregations(
	logger *zap.Logger,
	esClient *elasticsearch.Client,
	startDate time.Time,
	endDate time.Time,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	return nil, nil
}
