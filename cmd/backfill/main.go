package main

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

const filePath = `cmd/backfill/data/sensitive/databackfillSept.csv`

// const translationPath = `cmd/backfill/data/dataTranslation.csv`
const translationFullPath = `cmd/backfill/data/dataTranslationFull.csv`
const outputTranslatePath = `cmd/backfill/data/sensitive/databackfillSeptTranslated.json`
const outputTranslateEditPath = `cmd/backfill/data/sensitive/databackfillSeptTranslatedEdit.json`
const userPath = `cmd/backfill/data/possibleUsers.json`
const outputUploadPath = `cmd/backfill/data/sensitive/databackfillSeptUploaded.json`
const enumTranslationPath = `cmd/backfill/data/enumTranslations.json`

func main() { //TODO make this a command

	testTransform := true
	testUpload := true
	useEdit := false

	backfiller := getDefaultBackfiller()

	if testTransform {
		transformData(backfiller)
	}
	if testUpload {
		uploadData(backfiller, useEdit)
	}

}

func getDefaultBackfiller() *Backfiller {
	possibleUserList := []PossibleUser{}

	err := readJSONFromFile(userPath, &possibleUserList)
	if err != nil {
		log.Fatal(err)
	}
	possibleUserDict := NewPossibleUserDictionary(possibleUserList)

	enumTranslationList := []EmumTranslation{}
	err = readJSONFromFile(enumTranslationPath, &enumTranslationList)
	if err != nil {
		log.Fatal(err)
	}
	enumTranslationDict := NewEmumTranslationDictionary(enumTranslationList)
	backfiller := NewBackfiller(nil, possibleUserDict, enumTranslationDict) //make first so each translation can have a reference

	translation, err := readFile(translationFullPath)
	if err != nil {
		log.Fatal(err)
	}
	td := NewTranslationDictionary()

	td.convertDataTable(translation)
	backfiller.TDictionary = &td

	return backfiller
}
func uploadData(backfiller *Backfiller, useEdit bool) {
	var path string

	if useEdit {
		path = outputTranslateEditPath
	} else {
		path = outputTranslatePath
	}

	entries, err := getTransformedData(path)
	if err != nil {
		log.Default().Print("Error getting data from ", path)
		return
	}
	log.Default().Print("Uploading data from ", path)

	uploader := NewUploader(backfiller)
	uploader.uploadEntries(entries)
	writeObjectToJSONFile(entries, outputUploadPath)

}

// func valueOrPointer[anyType interface{}](value anyType, isPointer bool) reflect.Value {

func readJSONFromFile[anyType interface{}](file string, obj *anyType) error {

	f, err := os.Open(file) //nolint
	if err != nil {
		log.Fatal(err)
		return err
	}
	defer f.Close() //nolint

	byteValue, _ := ioutil.ReadAll(f)
	err = json.Unmarshal(byteValue, &obj)

	return err

}

func getTransformedData(file string) ([]*BackfillEntry, error) {
	f, err := os.Open(file) //nolint
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	// remember to close the file at the end of the program
	defer f.Close() //nolint

	byteValue, _ := ioutil.ReadAll(f)

	entries := []*BackfillEntry{}
	err = json.Unmarshal(byteValue, &entries)
	return entries, err
}
func transformData(backfiller *Backfiller) {

	table, err := readFile(filePath)

	if err != nil {
		log.Fatal(err)
	}

	// entries, err := translateFile(&td, table)
	entries, err := backfiller.translateFile(table)
	if err != nil {
		log.Fatal(err)
	}

	writeObjectToJSONFile(entries, outputTranslatePath)

}

func writeObjectToJSONFile(object interface{}, path string) {
	entryBytes, err := json.Marshal(object)
	if err != nil {
		panic("Can't serialize the object")
	}

	file, err := os.Create(filepath.Clean(path))
	if err != nil {

		panic("Can't create the file")
	}
	_, err = file.Write(entryBytes)
	if err != nil {
		panic("Can't write the file")
	}
}

// DataTable represents a table of data, (like a CSV or excel spreadshet)
type DataTable struct {
	Header map[int]string
	Rows   map[int]DataRow
}

// NewDataTable instantiates a DataTable
func NewDataTable() DataTable {
	return DataTable{
		Header: map[int]string{},
		Rows:   map[int]DataRow{},
	}
}

// DataRow is the representation of a row of data in a Data Table
type DataRow struct {
	Fields map[string]interface{}
}

// NewDataRow instantiates a DataRow
func NewDataRow() DataRow {
	return DataRow{
		Fields: map[string]interface{}{},
	}
}

func (dt *DataTable) processCSV(csv *csv.Reader) {
	header, headerErr := csv.Read()
	if headerErr != nil {
		log.Fatal(headerErr)
	}
	dt.processHeader(header)

	rowErrs := dt.processRows(csv)
	if len(rowErrs) > 0 {
		log.Fatal("something went wrong processing the rows")
	}
}

func (dt *DataTable) processHeader(header []string) {
	for i := 0; i < len(header); i++ {
		dt.Header[i] = header[i]

	}
}

func (dt *DataTable) processRows(csv *csv.Reader) []error {
	var err error

	errs := []error{}
	i := 0
	for err == nil {
		row, err := csv.Read()
		if err != nil {
			if err != io.EOF {
				errs = append(errs, err)
			}
			// continue
			break
		}

		dataRow := dt.processRow(row)
		dt.Rows[i] = dataRow
		i++
	}
	return errs

}

func (dt *DataTable) processRow(row []string) DataRow {

	dr := NewDataRow()
	for i := 0; i < len(row); i++ {
		dr.Fields[dt.Header[i]] = row[i] //Make a map with the header value as the key for the row
	}
	return dr
}

func readFile(file string) (*DataTable, error) {

	table := NewDataTable()
	// open file
	f, err := os.Open(file) //nolint
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	// remember to close the file at the end of the program
	defer f.Close() //nolint

	src := csv.NewReader(f)
	table.processCSV(src)

	return &table, nil
}
