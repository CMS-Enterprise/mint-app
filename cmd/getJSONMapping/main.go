package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
)

type fieldInfo struct {
	GoModel        string
	GQLModel       string
	TableName      string
	EmbeddedStruct *string
	GoField        string
	DataType       string

	GQLField string
	DBField  string
}

type modelInfo struct {
	GoModel   string
	TableName string
	ModelType reflect.Type
}

const jsonTAG = "json"
const dbTAG = "db"
const filePath = `cmd/getJSONMapping/result.JSON`

func main() {
	var models = []struct {
		GoModel   string
		TableName string
		ModelType reflect.Type
	}{
		// {"ModelPlan", "model_plan", reflect.TypeOf(models.ModelPlan{})},
		// {"ModelPlan", "ModelPlan", reflect.TypeOf(models.ModelPlan{})},
		// https://blog.boot.dev/golang/anonymous-structs-golang/

		{"AnalyzedAudit", "analyzed_audit", reflect.TypeOf(models.AnalyzedAudit{})},
		{"DiscussionReply", "discussion_reply", reflect.TypeOf(models.DiscussionReply{})},
		{"ExistingModel", "existing_model", reflect.TypeOf(models.ExistingModel{})},
		{"ExistingModelLink", "existing_model_link", reflect.TypeOf(models.ExistingModelLink{})},
		{"ModelPlan", "model_plan", reflect.TypeOf(models.ModelPlan{})},
		{"NdaAgreement", "nda_agreement", reflect.TypeOf(models.NDAAgreement{})},
		{"OperationalNeed", "operational_need", reflect.TypeOf(models.OperationalNeed{})},
		{"OperationalSolution", "operational_solution", reflect.TypeOf(models.OperationalSolution{})},
		{"OperationalSolutionSubtask", "operational_solution_subtask", reflect.TypeOf(models.OperationalSolutionSubtask{})},
		{"PlanBasics", "plan_basics", reflect.TypeOf(models.PlanBasics{})},
		{"PlanBeneficiaries", "plan_beneficiaries", reflect.TypeOf(models.PlanBeneficiaries{})},
		{"PlanCollaborator", "plan_collaborator", reflect.TypeOf(models.PlanCollaborator{})},
		{"PlanCrTdl", "plan_cr_tdl", reflect.TypeOf(models.PlanCrTdl{})},
		{"PlanDiscussion", "plan_discussion", reflect.TypeOf(models.PlanDiscussion{})},
		{"PlanDocument", "plan_document", reflect.TypeOf(models.PlanDocument{})},
		{"PlanDocumentSolutionLink", "plan_document_solution_link", reflect.TypeOf(models.PlanDocumentSolutionLink{})},
		{"PlanFavorite", "plan_favorite", reflect.TypeOf(models.PlanFavorite{})},
		{"PlanGeneralCharacteristics", "plan_general_characteristics", reflect.TypeOf(models.PlanGeneralCharacteristics{})},
		{"PlanOpsEvalAndLearning", "plan_ops_eval_and_learning", reflect.TypeOf(models.PlanOpsEvalAndLearning{})},
		{"PlanParticipantsAndProviders", "plan_participants_and_providers", reflect.TypeOf(models.PlanParticipantsAndProviders{})},
		{"PlanPayments", "plan_payments", reflect.TypeOf(models.PlanPayments{})},
		// {"PossibleNeedSolutionLink", "possible_need_solution_link", reflect.TypeOf(models.PossibleNeedSolutionLink{})},
		{"PossibleOperationalNeed", "possible_operational_need", reflect.TypeOf(models.PossibleOperationalNeed{})},
		{"PossibleOperationalSolution", "possible_operational_solution", reflect.TypeOf(models.PossibleOperationalSolution{})},
		{"UserAccount", "user_account", reflect.TypeOf(authentication.UserAccount{})},
	}
	fieldInfoArr := []*fieldInfo{}
	for _, model := range models {
		numFields := model.ModelType.NumField()
		for i := 0; i < numFields; i++ {
			field := model.ModelType.Field(i)

			fieldInfoArr = appendFieldInfo(fieldInfoArr, model, field, nil)
			// field.Type
			// TODO, check if it is a struct, if so, loop through the fields on the embedded struct? Or just don't? base struct etc has a lot embedded.

			// tfieldInfo := fieldInfo{
			// 	GoModel:   model.GoModel,
			// 	GQLModel:  model.GoModel,
			// 	TableName: model.TableName,
			// 	GoField:   field.Name,
			// 	DataType:  field.Type.String(),
			// 	GQLField:  field.Tag.Get(jsonTAG),
			// 	DBField:   field.Tag.Get(dbTAG),
			// }
			// fieldInfoArr = append(fieldInfoArr, &tfieldInfo)
			// // fmt.Print(field.Type.String())

			// fmt.Println("FIELD: %+v", tfieldInfo)
		}

	}

	// fmt.Println(fieldInfoArr)
	writeObjectToJSONFile(fieldInfoArr, filePath)

}

func appendFieldInfo(fieldInfoArray []*fieldInfo, model modelInfo, field reflect.StructField, embeddedStruct *string) []*fieldInfo {

	kind := field.Type.Kind()

	if kind == reflect.Struct { //UnNest Parent fields
		embeddedFieldsCount := field.Type.NumField()
		for i := 0; i < embeddedFieldsCount; i++ {
			var nestedStruct = field.Type.String()
			if embeddedStruct != nil {
				nestedStruct = fmt.Sprint(*embeddedStruct, " | ", field.Type.String())
			}

			// embeddedStruct +", " +field.Type.String()
			fieldInfoArray = appendFieldInfo(fieldInfoArray, model, field.Type.Field(i), &nestedStruct)

		}
		return fieldInfoArray
	}

	tfieldInfo := fieldInfo{
		GoModel:        model.GoModel,
		GQLModel:       model.GoModel,
		TableName:      model.TableName,
		EmbeddedStruct: embeddedStruct,
		GoField:        field.Name,
		DataType:       field.Type.String(),
		GQLField:       field.Tag.Get(jsonTAG),
		DBField:        field.Tag.Get(dbTAG),
	}
	fieldInfoArray = append(fieldInfoArray, &tfieldInfo)
	return fieldInfoArray

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
