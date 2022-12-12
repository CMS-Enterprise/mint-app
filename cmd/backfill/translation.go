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

func (t *Translation) handleTranslation(entry *BackfillEntry, value interface{}, backfiller *Backfiller) {

	// TODO handle the null value handling

	switch t.ModelName {
	case "Collaborator":
		valString := fmt.Sprint(value)
		allUsers := strings.Split(valString, ";#")
		for i := 0; i < len(allUsers); i++ {

			t.addCollaborator(entry, sanitizeName(allUsers[i]), backfiller.UDictionary)
		}
	default:
		if t.ModelName == "PlanPayments" && t.Field == "PayType" { //TODO, should I handle this later and just do it for this type?
			t.translatePayType(entry, value)
			return
		}
		if t.Header == "Resembles Existing Model" {

			t.translateResemblesExisting(entry, value)
			return
		}
		if t.Header == "Is APM Model" {
			t.translateIsAPM(entry, value)
		}
		// if t.ModelName == "PlanPayments" && t.Field == "NonClaimsPayments" { //TODO, should I handle this later and just do it for this type?
		// 	t.translateNonClaimsPaymentType(entry, value)
		// 	return
		// }

		t.translateField(entry, value, backfiller)
	}

}
func (t *Translation) translateIsAPM(entry *BackfillEntry, value interface{}) {
	if value == "NO" || value == "no" || value == "false" {
		entry.PlanGeneralCharacteristics.AlternativePaymentModelTypes = append(entry.PlanGeneralCharacteristics.AlternativePaymentModelTypes, "NOT_APM")
		return //ONLY ADD if it is true
	}
}
func (t *Translation) translateResemblesExisting(entry *BackfillEntry, value interface{}) {
	resembles := value != ""

	entry.PlanGeneralCharacteristics.ResemblesExistingModel = &resembles
	if resembles {
		allVals := strings.Split(fmt.Sprint(value), ";#")
		array := pq.StringArray{}
		for _, st := range allVals {
			array = append(array, st)
		}
		entry.PlanGeneralCharacteristics.ResemblesExistingModelWhich = array

	}

}

func (t *Translation) translatePayType(entry *BackfillEntry, value interface{}) {
	if value == "FALSE" {
		return //ONLY ADD if it is true
	}

	var valToAdd string

	//TODO handle all headers, make sure to add the string if needed. If possible, make this more generic too
	switch t.Header {
	case "Claims-Based Payments":
		valToAdd = "CLAIMS_BASED_PAYMENTS"
	case "Grants":
		valToAdd = "GRANTS"
	case "Claims-Based Payment Type":
		log.Default().Print("ClaimBasedPayment types found... values :", value)

	}

	if valToAdd == "" {
		return
	}
	entry.PlanPayments.PayType = append(entry.PlanPayments.PayType, valToAdd)

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

func (t *Translation) translateField(entry *BackfillEntry, value interface{}, backfiller *Backfiller) {
	if value == nil || value == "" {
		return
	}
	if value == "Yes, therefore overlaps would not be an issue" {
		log.Default().Print("here")
	}
	if t.ModelName == "?" {
		log.Default().Print("translation not known for " + t.Header + " . Value is " + fmt.Sprint(value))
		return
	}
	if t.ModelName == "NOT_NEEED" {
		log.Default().Print("translation not needed for " + t.Header + " . Value is " + fmt.Sprint(value) + " . Note : " + t.Note)
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

	field := reflect.Indirect(bModel).FieldByName(t.Field) //indirect because this is a pointer

	if !field.IsValid() {
		log.Default().Print("couldn't get field for for " + t.Header + " . Object name is " + fmt.Sprint(t.ModelName) + " . Field name is " + fmt.Sprint(t.Field))
		return
	}
	tErr := t.setField(&field, value, backfiller)
	if tErr != nil {
		entry.TErrors = append(entry.TErrors, *tErr) //record any setting issue here
		log.Default().Print("Error setting field: ", tErr)
	}

}

func (t *Translation) setField(field *reflect.Value, value interface{}, backfiller *Backfiller) *TranslationError {

	val := reflect.ValueOf(value)
	fieldKind := field.Kind()
	valType := val.Type()

	if field.CanConvert(valType) {
		field.Set(val)
		log.Default().Print("Converted sucessfully")
	} else {

		convVal, err := t.handleConversion(field, value, backfiller)
		if err != nil {
			return err

		}
		if convVal.IsValid() {

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

func (t *Translation) handleConversion(field *reflect.Value, value interface{}, backfiller *Backfiller) (reflect.Value, *TranslationError) {

	fieldKind := field.Kind()
	fieldType := field.Type()

	isPointer := fieldKind.String() == "ptr"
	var conVal reflect.Value
	var tErr *TranslationError
	fieldTypeS := strings.TrimPrefix(fieldType.String(), "*")
	valString := fmt.Sprint(value)

	switch fieldTypeS {
	case "string":
		conVal = valueOrPointer(valString, isPointer)

	case "pq.StringArray":

		pqArray := t.translateStringArray(valString, backfiller)
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
		if err != nil {
			tErr = &TranslationError{
				Translation: *t,
				Value:       value,
				Message:     fmt.Sprintf("type conversion failed to convert to bool for type %s", fieldType),
			}
		}
		conVal = valueOrPointer(bVal, isPointer)

	case "int":

		intVal, err := strconv.Atoi(valString)
		if err != nil {
			tErr = &TranslationError{
				Translation: *t,
				Value:       value,
				Message:     fmt.Sprintf("type conversion failed to convert to int for type %s", fieldType),
			}
		}
		conVal = valueOrPointer(intVal, isPointer)

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

	default:
		translatedString, isTranslated := t.translateEnum(valString, backfiller) //TODO should we do something to see if we found a match?

		//TODO handle TBD
		if !isTranslated {
			if strings.ToLower(valString) == "tbd" {
				tErr = &TranslationError{
					Translation: *t,
					Value:       value,
					Message:     fmt.Sprintf(" tbd is not a valid entry for field %s", t.Field),
				}
			} else {
				tErr = &TranslationError{
					Translation: *t,
					Value:       value,
					Message:     fmt.Sprintf("type conversion not handled for type %s", fieldType),
				}
			}

		}
		//TODO cast the value as the field value

		conVal = valueOrPointerOfType(translatedString, isPointer, fieldTypeS)

		// conVal = valueOrPointer(translatedString, isPointer)

	}

	return conVal, tErr

}

// func ( t *Translation)[anyType interface{}] tryTranslateEnum(string ,){

// }
func (t *Translation) translateStringArray(allValueString string, backfiller *Backfiller) pq.StringArray {
	allVals := strings.Split(allValueString, ";#")
	array := pq.StringArray{}
	for _, st := range allVals {
		enVal, _ := t.translateEnum(st, backfiller)
		array = append(array, enVal)
	}
	return array
}

func (t *Translation) translateEnum(st string, backfiller *Backfiller) (string, bool) {

	enumTrans, transFound := backfiller.EnumDictionary.tryGetEnumByValue(st, t)
	if !transFound {
		log.Default().Print("couldn't translate string : ", st, " for Model : ", t.ModelName, ". Field : ", t.Field)
		return st, transFound
	}

	retVal := enumTrans.Enum
	if retVal == "" {
		log.Default().Print("enum is not defined for : ", st)

	}
	if retVal == "ADVANCED" {
		log.Default().Print("Found ADVANCED, original string was : ", st)
	}
	return retVal, transFound
}

func valueOrPointer[anyType interface{}](value anyType, isPointer bool) reflect.Value {

	if isPointer {
		return reflect.ValueOf(&value)
	}
	return reflect.ValueOf(value)

}

// func valueOrPointerOfType[enumType ~string](field enumType, transEnum interface{}, isPointer bool) reflect.Value {

// 	typedString := transEnum.(enumType)

// 	return valueOrPointer(typedString, isPointer)

// }

func valueOrPointerOfType(transEnum string, isPointer bool, fieldType string) reflect.Value {
	var refVal reflect.Value

	switch fieldType {

	case "models.ModelType":
		refVal = valueOrPointer(models.ModelType(transEnum), isPointer)
	case "models.OverlapType":
		refVal = valueOrPointer(models.OverlapType(transEnum), isPointer)
	case "models.ModelCategory":
		refVal = valueOrPointer(models.ModelCategory(transEnum), isPointer)
	case "models.ParticipantRiskType":
		refVal = valueOrPointer(models.ParticipantRiskType(transEnum), isPointer)
	case "models.BenchmarkForPerformanceType":
		refVal = valueOrPointer(models.BenchmarkForPerformanceType(transEnum), isPointer)
	case "models.DataStartsType":
		refVal = valueOrPointer(models.DataStartsType(transEnum), isPointer)
	case "models.RecruitmentType":
		refVal = valueOrPointer(models.RecruitmentType(transEnum), isPointer)
	case "models.ComplexityCalculationLevelType":
		refVal = valueOrPointer(models.ComplexityCalculationLevelType(transEnum), isPointer)
	default:
		log.Default().Print("unhandled enumType: ", fieldType)
		return valueOrPointer(transEnum, isPointer)
	}
	return refVal
}
