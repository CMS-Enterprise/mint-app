package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"reflect"
)

func main() {
	filePath := `cmd/backfill/data/sensitive/databackfillSept.csv`
	translationPath := `cmd/backfill/data/dataTranslation.csv`
	outputPath := `cmd/backfill/data/sensitive/databackfillSeptTranslated.json`

	table, err := readFile(filePath)

	if err != nil {
		log.Fatal(err)
	}

	translation, err := readFile(translationPath)
	if err != nil {
		log.Fatal(err)
	}
	td := NewTranslationDictionary()
	td.convertDataTable(translation)

	// entries, err := translateFile(&td, table)
	entries, err := translateFile(&td, table)
	if err != nil {
		log.Fatal(err)
	}

	entryBytes, err := json.Marshal(entries)
	if err != nil {
		panic("Can't serialize the entries")
	}

	file, err := os.Create(outputPath)
	if err != nil {
		panic("Can't create the file")
	}
	_, err = file.Write(entryBytes)
	if err != nil {
		panic("Can't write the file")
	}
	// os.WriteFile(outputPath,entries,)

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

	// 1. translate the data to our models

	// 2. Upload the data to the database

	return &table, nil
}

func translateFile(td *TranslationsDictionary, table *DataTable) (*[]BackfillEntry, error) {

	entries := []BackfillEntry{}
	// dec, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
	// 	ErrorUnused: true,
	// 	TagName:     "json",
	// 	Result:      to,
	// 	ZeroFields:  true,
	// 	Squash:      true,
	// })

	for i := 0; i < len(table.Rows); i++ {
		row := table.Rows[i]
		entry := translateDataRow(&row, td)
		entries = append(entries, *entry)

	}

	return &entries, nil
}

func translateDataRow(row *DataRow, td *TranslationsDictionary) *BackfillEntry {
	entry := NewBackFillEntry()
	for key, value := range row.Fields {

		// translation := td[row.Fields[i]]
		translation := td.getTranslation(key)

		translateField(&entry, value, &translation)
	}
	return &entry

}

func translateField(entry *BackfillEntry, value interface{}, translation *Translation) {
	if value == nil || value == "" {
		return
	}
	if translation.Header == "Track Gainsharing Payments" {
		log.Default().Print("this")
	}

	// VEntry := reflect.ValueOf(entry)
	if translation.ModelName == "?" || translation.ModelName == "" {
		log.Default().Print("translation not defined for " + translation.Header + " . Value is " + fmt.Sprint(value))
		return

	}
	oEntry := reflect.ValueOf(entry).Elem().FieldByName(translation.ModelName)
	if !oEntry.IsValid() {
		log.Default().Print("couldn't get object for " + translation.Header + " . Object name is " + fmt.Sprint(translation.ModelName))
		return
	}
	log.Default().Print(oEntry.Kind())
	// oEntry := reflect.Indirect(VEntry).FieldByName(translation.ModelName)

	// oEntry := reflect.ValueOf(obj).Elem()

	val := reflect.ValueOf(value)
	log.Default().Print(oEntry.Addr().Elem())

	field := oEntry.FieldByName(translation.Field)

	if !field.IsValid() {
		log.Default().Print("couldn't get field for for " + translation.Header + " . Object name is " + fmt.Sprint(translation.ModelName) + " . Field name is " + fmt.Sprint(translation.Field))
		return
	}
	// field := reflect.ValueOf(oEntry).FieldByName(translation.Field)

	// if field.CanSet() (
	// 	field.se

	// )

	//panic: reflect.Value.Addr of unaddressable value --> Handle these instances
	fieldKind := field.Kind()
	log.Default().Print(fieldKind)
	if field.CanConvert(val.Type()) {
		field.Set(val)
		log.Default().Print("Converted sucessfully")
	} else { //MOVE to A FUNCTION
		// try convert

		log.Default().Print(val.Type(), " CAN't Convert to needed type ", fieldKind)
	}

	log.Default().Print(field.CanSet())

	// TODO function that takes an interface of type and tries to cast the value? Maybe a receiver method
	// func setField(field, field kind, value, translation)
	log.Default().Print(translation, field, fieldKind, val)

	//TODO set the fields value! --> need to do some switching or configuration to make this work...
	// field.Set(value)

}
