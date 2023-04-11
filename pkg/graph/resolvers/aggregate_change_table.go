package resolvers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/opensearch-project/opensearch-go/v2"

	"go.uber.org/zap"

	"github.com/elastic/go-elasticsearch/v8/esapi"

	"github.com/cmsgov/mint-app/pkg/models"
)

func createDateHistogram(timeDuration string, limit int) (string, error) {
	duration, err := time.ParseDuration(timeDuration)
	if err != nil {
		return "", err
	}

	query := fmt.Sprintf(`{
		"size": 0,
		"aggs": {
			"changes_over_time": {
				"terms": {
					"script": {
						"source": "doc['modified_dts'].value.toInstant().toEpochMilli() / %d"
					},
					"size": %d
				},
				"aggs": {
					"min_modified_dts": {
						"min": {
							"field": "modified_dts"
						}
					},
					"max_modified_dts": {
						"max": {
							"field": "modified_dts"
						}
					}
				}
			}
		}
	}`, duration.Milliseconds(), limit)

	return query, nil
}

func searchAndUnmarshal(
	searchClient *opensearch.Client,
	query string,
	result interface{},
) error {
	req := esapi.SearchRequest{
		Index: []string{"change_table_idx"},
		Body:  strings.NewReader(query),
	}

	res, err := req.Do(context.Background(), searchClient)
	if err != nil {
		return err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			fmt.Println(err)
		}
	}(res.Body)

	if res.IsError() {
		var e map[string]interface{}
		if err := json.NewDecoder(res.Body).Decode(&e); err != nil {
			return fmt.Errorf("error parsing the response body: %s", err)
		}
		return fmt.Errorf("[%s] %s: %s", res.Status(), e["error"].(map[string]interface{})["type"], e["error"].(map[string]interface{})["reason"])
	}

	if err := json.NewDecoder(res.Body).Decode(result); err != nil {
		return fmt.Errorf("error decoding the response body: %s", err)
	}

	return nil
}

func consolidateBuckets(buckets []*models.DateHistogramAggregationBucket) ([]*models.DateHistogramAggregationBucket, error) {
	if len(buckets) == 0 {
		return buckets, nil
	}

	consolidatedBuckets := make([]*models.DateHistogramAggregationBucket, 0)
	bucketHead := *buckets[0]
	prevKey, err := strconv.Atoi(bucketHead.Key)
	if err != nil {
		return nil, err
	}

	for i := 1; i < len(buckets); i++ {
		curKey, err := strconv.Atoi(buckets[i].Key)
		if err != nil {
			return nil, err
		}

		bucketHead, prevKey, err = processBucket(bucketHead, buckets[i], prevKey, curKey, &consolidatedBuckets)
		if err != nil {
			return nil, err
		}
	}

	consolidatedBuckets = append(consolidatedBuckets, &bucketHead)
	return consolidatedBuckets, nil
}

func isContiguous(prevKey int, curKey int) bool {
	return prevKey+1 == curKey
}

func mergeBuckets(head *models.DateHistogramAggregationBucket, next *models.DateHistogramAggregationBucket) *models.DateHistogramAggregationBucket {
	head.DocCount += next.DocCount
	head.MaxModifiedDts = next.MaxModifiedDts
	return head
}

func processBucket(bucketHead models.DateHistogramAggregationBucket, currentBucket *models.DateHistogramAggregationBucket, prevKey int, curKey int, consolidatedBuckets *[]*models.DateHistogramAggregationBucket) (models.DateHistogramAggregationBucket, int, error) {
	if isContiguous(prevKey, curKey) {
		bucketHead = *mergeBuckets(&bucketHead, currentBucket)
	} else {
		*consolidatedBuckets = append(*consolidatedBuckets, &bucketHead)
		bucketHead = *currentBucket
	}

	return bucketHead, curKey, nil
}

// SearchChangeTableDateHistogramConsolidatedAggregations returns a list of date histogram buckets for the change table
func SearchChangeTableDateHistogramConsolidatedAggregations(
	logger *zap.Logger,
	searchClient *opensearch.Client,
	timeDuration string,
	limit int,
	offset int,
) ([]*models.DateHistogramAggregationBucket, error) {
	query, err := createDateHistogram(timeDuration, limit)
	if err != nil {
		logger.Error("error creating duration query", zap.Error(err))
		return nil, err
	}

	var response models.DateHistogramAggregationResponse
	err = searchAndUnmarshal(searchClient, query, &response)
	if err != nil {
		return nil, err
	}

	buckets := make([]*models.DateHistogramAggregationBucket, len(response.Aggregations.ChangesOverTime.Buckets))
	for i := range response.Aggregations.ChangesOverTime.Buckets {
		rawBucket := &response.Aggregations.ChangesOverTime.Buckets[i]
		bucket, err2 := models.NewDateHistogramAggregationBucketFromRaw(rawBucket)
		if err2 != nil {
			logger.Error("error converting raw bucket to DateHistogramAggregationBucket", zap.Error(err))
			return nil, err2
		}

		buckets[i] = bucket
	}

	consolidatedBuckets, err := consolidateBuckets(buckets)
	if err != nil {
		logger.Error("error consolidating buckets", zap.Error(err))
		return nil, err
	}

	return consolidatedBuckets, nil
}
