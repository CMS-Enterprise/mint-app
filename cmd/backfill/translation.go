package main

import (
	"fmt"
	"log"
	"reflect"
	"strconv"

	"github.com/lib/pq"

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
	bModel := reflect.ValueOf(entry).Elem().FieldByName(t.ModelName)
	// bModel := reflect.Indirect().Elem().FieldByName(t.ModelName)
	// interF, bModel := t.getObject(entry)

	// log.Default().Print(" " + fmt.Sprintf(%s,)) + " . Object name is " + fmt.Sprint(t.ModelName))
	if !bModel.IsValid() {
		log.Default().Print("couldn't get object for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName))
		return
	}

	log.Default().Print("buisness model kind: ", bModel.Kind(), ". buisness model type: ", bModel.Type())
	// bModel := reflect.Indirect(VEntry).FieldByName(t.ModelName)

	log.Default().Print(bModel.Addr().Elem())

	field := reflect.Indirect(bModel).FieldByName(t.Field) //indirect because this is now a pointer

	// field := bModel.FieldByName(t.Field)

	if !field.IsValid() {
		log.Default().Print("couldn't get field for for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName) + " . Field name is " + fmt.Sprint(t.Field))
		return
	}
	tErr := t.setField(&field, value, bModel) //Need to pass a Refence to the struct potentially to set that field?
	if tErr != nil {
		entry.Errors = append(entry.Errors, *tErr) //record any setting issue here
	}
	log.Default().Print("Tried to set the field. It is now :", field)

}

func (t *Translation) setField(field *reflect.Value, value interface{}, obj interface{}) *TranslationError {

	val := reflect.ValueOf(value)
	fieldKind := field.Kind()
	fieldType := field.Type()
	valType := val.Type()
	log.Default().Print(fieldKind)
	if fieldKind.String() == "ptr" {
		log.Default().Print("found")
		// element := field.Elem()
		log.Default().Print(t, " ", fieldType)
		// underlyingType := element.Type()
		// log.Default().Print(element, " ", underlyingType)

	}
	if field.CanConvert(valType) {
		field.Set(val)
		log.Default().Print("Converted sucessfully")
	} else {

		convVal, err := t.handleConversion(field, fieldType, value, val, valType, obj)
		if err != nil {
			return err

		}
		if convVal.IsValid() { //TODO need to handle converstion and apply the value better
			field.Set(convVal)
			return nil
		}

		return &TranslationError{
			Translation: *t,
			Message:     fmt.Sprintf(" CAN't Convert to needed type %s", fieldKind),
		}

		// log.Default().Print(val.Type(), " CAN't Convert to needed type ", fieldKind)
	}

	log.Default().Print(field.CanSet())

	return nil

}

func (t *Translation) handleConversion(field *reflect.Value, fieldType reflect.Type, value interface{}, val reflect.Value, valType reflect.Type, object interface{}) (reflect.Value, *TranslationError) {

	// mapstructure.Decode(val, &field)
	//TODO FIX THIS! We need to actual handle a real field or something.... This doesn't work like this

	fieldKind := field.Kind()

	isPointer := fieldKind.String() == "ptr"
	log.Default().Print("Pointer? ", isPointer)
	conVal := reflect.Value{}
	var tErr *TranslationError
	switch fieldType.String() {
	case "*string":
		pnter := fmt.Sprint(value)
		conVal = reflect.ValueOf(&pnter)

	case "pq.StringArray":
		conVal = reflect.ValueOf(pq.StringArray{value.(string)})

	case "*bool":
		bVal, err := strconv.ParseBool(fmt.Sprint(value))
		//TODO need to handle yes/ no, which we don't right now
		if err != nil {
			tErr = &TranslationError{
				Translation: *t,
				Value:       value,
				Message:     fmt.Sprintf("type conversion failed to convert to bool for type %s", fieldType),
			}
		}
		conVal = reflect.ValueOf(&bVal)

	case "*time.Time":

		//TODO handle this

	default:
		tErr = &TranslationError{
			Translation: *t,
			Value:       value,
			Message:     fmt.Sprintf("type conversion not handled for type %s", fieldType),
		}

	}

	return conVal, tErr

}
