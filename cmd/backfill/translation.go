package main

import (
	"fmt"
	"log"
	"reflect"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
)

// Translation is the type used to translate the data from one source to another
type Translation struct {
	Header     string `json:"Header"`
	ModelName  string `json:"ModelName"`
	Field      string `json:"Field"`
	Direct     string `json:"Direct"`
	Note       string `json:"Note"`
	OtherField string `json:"OtherField"`
}

// TranslationsDictionary is the type used to store a referene to all of the different translations
type TranslationsDictionary map[string]Translation

// NewTranslationDictionary instantiates a translation dictionary
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
	// tVal := reflect.ValueOf(translation)

	err := resolvers.ApplyChanges(row.Fields, &translation)
	if err != nil {
		log.Fatal(err)
	}
	// tType := reflect.TypeOf(translation)

	// for key, value := range row.Fields {
	// 	field := tVal.FieldByName(key)
	// 	if field.CanSet() {
	// 		field.SetString(value)
	// 		continue
	// 	}
	// 	log.Fatal("Couldn't set the translation")

	// }
	return translation

}

func (dt TranslationsDictionary) getTranslation(key string) Translation {
	return dt[key]
}

func (t *Translation) translateField(entry *BackfillEntry, value interface{}) {
	if value == nil || value == "" {
		return
	}
	if t.Header == "Track Gainsharing Payments" {
		log.Default().Print("this")
	}

	// VEntry := reflect.ValueOf(entry)
	if t.ModelName == "?" || t.ModelName == "" {
		log.Default().Print("translation not defined for " + t.Header + " . Value is " + fmt.Sprint(value))
		return

	}
	oEntry := reflect.ValueOf(entry).Elem().FieldByName(t.ModelName)
	if !oEntry.IsValid() {
		log.Default().Print("couldn't get object for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName))
		return
	}
	log.Default().Print(oEntry.Kind())
	// oEntry := reflect.Indirect(VEntry).FieldByName(t.ModelName)

	// oEntry := reflect.ValueOf(obj).Elem()

	val := reflect.ValueOf(value)
	log.Default().Print(oEntry.Addr().Elem())

	field := oEntry.FieldByName(t.Field)

	if !field.IsValid() {
		log.Default().Print("couldn't get field for for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName) + " . Field name is " + fmt.Sprint(t.Field))
		return
	}
	// field := reflect.ValueOf(oEntry).FieldByName(t.Field)

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
	log.Default().Print(t, field, fieldKind, val)

	//TODO set the fields value! --> need to do some switching or configuration to make this work...
	// field.Set(value)

}
