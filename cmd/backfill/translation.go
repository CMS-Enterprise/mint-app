package main

import (
	"fmt"
	"log"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
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

	err := resolvers.ApplyChanges(row.Fields, &translation)
	if err != nil {
		log.Fatal(err)
	}
	return translation

}

func (dt TranslationsDictionary) getTranslation(key string) Translation {
	return dt[key]
}

func (t *Translation) handleTranslation(entry *BackfillEntry, value interface{}, userDictionary *PossibleUserDictionary) {

	// TODO handle the null value handling

	switch t.ModelName {
	case "Collaborator":
		valString := fmt.Sprint(value)
		allUsers := strings.Split(valString, ";#")
		for i := 0; i < len(allUsers); i++ {

			t.addCollaborator(entry, sanitizeName(allUsers[i]), userDictionary)
		}
	default:
		t.translateField(entry, value)
	}

}

func sanitizeName(name string) string {
	clean := strings.TrimPrefix(name, "#")
	//TODO check if it's a number, and if so, don't use it

	// if _, err := strconv.Atoi(v); err == nil {
	//     fmt.Printf("%q looks like a number.\n", v)
	// }
	return clean
}
func (t *Translation) addCollaborator(entry *BackfillEntry, valString string, userDictionary *PossibleUserDictionary) {

	user := userDictionary.tryGetUserByName(valString)
	if user == nil {

		tErr := &TranslationError{
			Translation: *t,
			Message:     fmt.Sprintf(" Can't Find user to add as collab %s", valString),
		}
		entry.TErrors = append(entry.TErrors, *tErr) //record any setting issue here
		return
	}

	role := models.TeamRole(t.Field)

	collab := models.NewPlanCollaborator(user.EUAID, uuid.UUID{}, user.EUAID, user.Name, role, user.Email)
	entry.Collaborators = append(entry.Collaborators, collab)

}

func (t *Translation) translateField(entry *BackfillEntry, value interface{}) {
	if value == nil || value == "" {
		return
	}
	if t.ModelName == "?" {
		log.Default().Print("translation not known for " + t.Header + " . Value is " + fmt.Sprint(value))
		return
	}
	if t.ModelName == "" {
		log.Default().Print("translation has not yet been mapped for for " + t.Header + " . Value is " + fmt.Sprint(value))
		return
	}
	bModel := reflect.ValueOf(entry).Elem().FieldByName(t.ModelName)

	if !bModel.IsValid() {
		log.Default().Print("couldn't get object for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName))
		return
	}

	// log.Default().Print("buisness model type: ", bModel.Type()) //, "buisness model kind: ", bModel.Kind(), ".")

	field := reflect.Indirect(bModel).FieldByName(t.Field) //indirect because this is a pointer

	if !field.IsValid() {
		log.Default().Print("couldn't get field for for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName) + " . Field name is " + fmt.Sprint(t.Field))
		return
	}
	tErr := t.setField(&field, value, bModel) //Need to pass a Reference to the struct potentially to set that field?
	if tErr != nil {
		entry.TErrors = append(entry.TErrors, *tErr) //record any setting issue here
	}
	log.Default().Print("Set the field? ", tErr == nil, "  It is now : ", field, " Error? ", tErr)

}

func (t *Translation) setField(field *reflect.Value, value interface{}, obj interface{}) *TranslationError {

	val := reflect.ValueOf(value)
	fieldKind := field.Kind()
	fieldType := field.Type()
	valType := val.Type()

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
			Message:     fmt.Sprintf(" Can't Convert to needed type %s", fieldKind),
		}

	}

	return nil

}

func (t *Translation) handleConversion(field *reflect.Value, fieldType reflect.Type, value interface{}, val reflect.Value, valType reflect.Type, object interface{}) (reflect.Value, *TranslationError) {

	fieldKind := field.Kind()

	isPointer := fieldKind.String() == "ptr"
	conVal := reflect.Value{}
	var tErr *TranslationError
	fieldTypeS := strings.TrimPrefix(fieldType.String(), "*")
	valString := fmt.Sprint(value)

	switch fieldTypeS { //TODO handle pointer and non pointer the same, just return the value as a pointer at the end if is a pointer
	case "string":
		conVal = valueOrPointer(valString, isPointer)

	case "pq.StringArray":

		pqArray := translateStringArray(valString)
		// conVal = reflect.ValueOf(pq.StringArray{value.(string)})
		// conVal = valueOrPointer(pq.StringArray{value.(string)}, isPointer)
		conVal = valueOrPointer(pqArray, isPointer)

	case "bool":
		bVal, err := strconv.ParseBool(valString)
		if err != nil {

			if strings.ToLower(valString) == "yes" {
				bVal = true
				err = nil
			} else if strings.ToLower(valString) == "no" {
				bVal = false
				err = nil
			}
		}
		//TODO need to handle yes/ no, which we don't right now
		if err != nil {
			tErr = &TranslationError{
				Translation: *t,
				Value:       value,
				Message:     fmt.Sprintf("type conversion failed to convert to bool for type %s", fieldType),
			}
		}
		conVal = valueOrPointer(bVal, isPointer)

	case "time.Time":

		//month/date/year format from SharePoint
		layout := "1/2/2006" //just date formats look like this
		tVal, err := time.Parse(layout, valString)
		if err != nil {
			layout2 := "1/2/06 15:04"
			tVal, err = time.Parse(layout2, valString)
			if err != nil {
				tErr = &TranslationError{
					Translation: *t,
					Value:       value,
					Message:     fmt.Sprintf("type conversion failed to convert to *time for type %s", fieldType),
				}
			}
		}
		conVal = valueOrPointer(tVal, isPointer)
	case "models.DataStartsType": //TODO generically handle string enum types, how do we validate the input?
		enumType := models.DataStartsType(valString)
		conVal = valueOrPointer(enumType, isPointer) //THE DATA is not in the same format, it is more human readable
		//"Shortly before the start date"
		// TODO, match case, and see if it matches the enum value types...

	case "models.OverlapType":
		enumType := models.OverlapType(valString)
		conVal = valueOrPointer(enumType, isPointer)

	default:
		tErr = &TranslationError{
			Translation: *t,
			Value:       value,
			Message:     fmt.Sprintf("type conversion not handled for type %s", fieldType),
		}

	}

	// if tErr != nil && valString == "TBD" {
	// 	//TODO handle these nil cases.
	// }

	return conVal, tErr

}
func translateStringArray(allValueString string) pq.StringArray {
	allVals := strings.Split(allValueString, ";#")
	array := pq.StringArray{}
	for _, st := range allVals {
		enVal := translateEnum(st)
		array = append(array, enVal)
	}
	return array
}

func translateEnum(st string) string {
	//TODO get a table of translations, then translate this whole thing
	return st
}

func valueOrPointer[anyType interface{}](value anyType, isPointer bool) reflect.Value {

	if isPointer {
		return reflect.ValueOf(&value)
	}
	return reflect.ValueOf(value)

}
