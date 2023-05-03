package resolvers

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"text/template"
	"time"

	"github.com/opensearch-project/opensearch-go/v2"
	"github.com/opensearch-project/opensearch-go/v2/opensearchapi"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

// SearchQueryTemplate is an enum for the different search query templates
type SearchQueryTemplate string

// These are the different search query template enums
const (
	FreeTextSearchTemplate    SearchQueryTemplate = "FreeTextSearch"
	ModelPlanIDSearchTemplate SearchQueryTemplate = "ModelPlanIDSearch"
	DateRangeSearchTemplate   SearchQueryTemplate = "DateRangeSearch"
	ActorSearchTemplate       SearchQueryTemplate = "ActorSearch"
	ModelStatusSearchTemplate SearchQueryTemplate = "ModelStatusSearch"
)

// Embed the template files
//
//go:embed searchquerytemplates/free_text.tmpl
var freeTextSearchTmpl string

//go:embed searchquerytemplates/by_model_plan_id.tmpl
var modelPlanIDSearchTmpl string

//go:embed searchquerytemplates/by_date_range.tmpl
var dateRangeSearchTmpl string

//go:embed searchquerytemplates/by_actor.tmpl
var actorSearchTmpl string

//go:embed searchquerytemplates/by_model_status.tmpl
var modelStatusSearchTmpl string

var templateFileMapping = map[SearchQueryTemplate]string{
	FreeTextSearchTemplate:    freeTextSearchTmpl,
	ModelPlanIDSearchTemplate: modelPlanIDSearchTmpl,
	DateRangeSearchTemplate:   dateRangeSearchTmpl,
	ActorSearchTemplate:       actorSearchTmpl,
	ModelStatusSearchTemplate: modelStatusSearchTmpl,
}

var templateCache = make(map[SearchQueryTemplate]*template.Template)

func getTemplate(tmplEnum SearchQueryTemplate) (*template.Template, error) {
	if tmpl, ok := templateCache[tmplEnum]; ok {
		return tmpl, nil
	}

	tmplContent, ok := templateFileMapping[tmplEnum]
	if !ok {
		return nil, fmt.Errorf("template enum not found in templateFileMapping: %v", tmplEnum)
	}

	tmpl, err := template.New(string(tmplEnum)).Parse(tmplContent)
	if err != nil {
		return nil, err
	}

	templateCache[tmplEnum] = tmpl
	return tmpl, nil
}

// convertQueryToReader converts a string to an io.Reader
func convertQueryToReader(query string) (io.Reader, error) {
	return strings.NewReader(query), nil
}

func buildSearchQuery(tmpl SearchQueryTemplate, data map[string]interface{}) (string, error) {
	queryTemplate, err := getTemplate(tmpl)
	if err != nil {
		return "", err
	}
	var queryBuffer bytes.Buffer
	err = queryTemplate.Execute(&queryBuffer, data)
	if err != nil {
		return "", err
	}
	return queryBuffer.String(), nil
}

// marshalSearchQuery converts a SearchRequest to an io.Reader
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

		// Process the fields
		fieldsMap, ok := source["fields"].(map[string]interface{})
		if ok {
			for key, value := range fieldsMap {
				fieldValueBytes, err := json.Marshal(value)
				if err != nil {
					logger.Error("Error marshaling field value into JSON", zap.Error(err))
					return nil, fmt.Errorf("error marshaling field value into JSON: %s", err)
				}

				var fieldValue models.FieldValue
				if err := json.Unmarshal(fieldValueBytes, &fieldValue); err != nil {
					logger.Error("Error unmarshalling JSON into FieldValue", zap.Error(err))
					return nil, fmt.Errorf("error unmarshaling JSON into FieldValue: %s", err)
				}

				record.Fields.Changes = append(record.Fields.Changes, &models.Field{
					Name:  key,
					Value: fieldValue,
				})
			}
		}

		changeTableRecords = append(changeTableRecords, &record)
	}
	return changeTableRecords, nil
}

func searchChangeTableBaseWithQueryString(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	query string,
	limit int,
	offset int,
	sortBy string,
) ([]*models.ChangeTableRecord, error) {
	queryReader, err := convertQueryToReader(query)
	if err != nil {
		return nil, err
	}

	return searchChangeTableBase(logger, searchClient, queryReader, limit, offset, sortBy)
}

// Search functions for change table
func searchChangeTableBase(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	queryReader io.Reader,
	limit int,
	offset int,
	sortBy string,
) ([]*models.ChangeTableRecord, error) {
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
	queryReader, err := marshalSearchQuery(request)
	if err != nil {
		logger.Error("Error marshaling search query", zap.Error(err))
		return nil, err
	}

	return searchChangeTableBase(logger, searchClient, queryReader, limit, offset, sortBy)
}

// SearchChangeTableWithFreeText searches for change table records in search using a free-text search
func SearchChangeTableWithFreeText(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	searchText string,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query, err := buildSearchQuery(FreeTextSearchTemplate, map[string]interface{}{
		"SearchText": searchText,
	})
	if err != nil {
		return nil, err
	}

	return searchChangeTableBaseWithQueryString(logger, searchClient, query, limit, offset, "_score:desc")
}

// SearchChangeTableByModelPlanID searches the change table for records matching the given model plan ID
func SearchChangeTableByModelPlanID(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	modelPlanID uuid.UUID,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query, err := buildSearchQuery(ModelPlanIDSearchTemplate, map[string]interface{}{
		"ModelPlanID": modelPlanID.String(),
	})
	if err != nil {
		return nil, err
	}

	return searchChangeTableBaseWithQueryString(logger, searchClient, query, limit, offset, "modified_dts:desc")
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
	query, err := buildSearchQuery(DateRangeSearchTemplate, map[string]interface{}{
		"StartDate": startDate.Format(time.RFC3339),
		"EndDate":   endDate.Format(time.RFC3339),
	})
	if err != nil {
		return nil, err
	}

	return searchChangeTableBaseWithQueryString(logger, searchClient, query, limit, offset, "modified_dts:desc")
}

// SearchChangeTableByActor searches the change table for records with a modified_by field matching the given actor
func SearchChangeTableByActor(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	actor string,
	limit int,
	offset int,
) ([]*models.ChangeTableRecord, error) {
	query, err := buildSearchQuery(ActorSearchTemplate, map[string]interface{}{
		"Actor": actor,
	})
	if err != nil {
		return nil, err
	}

	return searchChangeTableBaseWithQueryString(logger, searchClient, query, limit, offset, "_score:desc")
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
	query, err := buildSearchQuery(ModelStatusSearchTemplate, map[string]interface{}{
		"Status": status,
	})
	if err != nil {
		return nil, err
	}

	return searchChangeTableBaseWithQueryString(logger, searchClient, query, limit, offset, "modified_dts:desc")
}
