package parquet

import (
	"github.com/parquet-go/parquet-go"

	"github.com/cms-enterprise/mint-app/pkg/s3"
)

func ReadFromS3[T any](client *s3.S3Client, key string) ([]T, error) {

	readerAt, size, err := client.GetS3ObjectReaderAt(key)
	if err != nil {
		return nil, err
	}
	data, err := parquet.Read[T](readerAt, size)
	if err != nil {
		return nil, err
	}
	return data, nil

}
