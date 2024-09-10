package parquet

import (
	"github.com/parquet-go/parquet-go"

	"github.com/cmsgov/mint-app/pkg/s3"
)

func ReadFromS3[T any](client *s3.S3Client, key string) ([]*T, error) {

	readerAt, size, err := client.GetS3ObjectReaderAt(key)
	if err != nil {
		return nil, err
	}
	data, err := parquet.Read[T](readerAt, size)
	if err != nil {
		return nil, err
	}
	result := []*T{}
	for _, row := range data {
		result = append(result, &row)

	}
	return result, nil

	// // Create a Parquet reader
	// fr, err := parquet.OpenFile(readerAt, size)
	// if err != nil {
	// 	fmt.Println("Error creating Parquet reader:", err)
	// 	return nil, err
	// }

	// // Create a RowGroup reader

	// parquet.ScanRowReader()

	// rgReader := fr.RowGroups()[0] // Assume we only have 1 RowGroup for simplicity
	// rows := rgReader
	// rgre
	// // Iterate over the rows and read into EchimpTDL structs
	// for rows.Next() {
	// 	var record models.EchimpTDL
	// 	if err := rows.Scan(&record); err != nil {
	// 		fmt.Println("Error reading row:", err)
	// 		return nil, err
	// 	}
	// 	fmt.Printf("%+v\n", record)
	// }

	// if err := rows.Err(); err != nil {
	// 	fmt.Println("Error reading rows:", err)
	// }
}
