package main

import (
	"log"
	"reflect"
)

type Translation struct {
	Header     string
	ModelName  string
	Field      string
	Direct     string
	Note       string
	OtherField string
}

type TranslationsDictionary map[string]Translation

func NewTranslationDictionary() TranslationsDictionary {
	return TranslationsDictionary{}
}

func (dt TranslationsDictionary) convertDataTable(table *DataTable) {

	for i := 0; i < len(table.Rows); i++ {
		translation := processTranslationRow(table.Rows[i])

		dt[translation.Header] = translation
	}

}

func processTranslationRow(row DataRow) Translation {
	translation := Translation{}
	tVal := reflect.ValueOf(translation)
	tType := reflect.TypeOf(translation)

	for key, value := range row.Fields {
		field := tVal.FieldByName(key)
		if field.CanSet() {
			field.SetString(value)
			continue
		}
		log.Fatal("Couldn't set the translation")

	}
	return translation

}

func (dt TranslationsDictionary) getTranslation(key string) Translation {
	return dt[key]
}
