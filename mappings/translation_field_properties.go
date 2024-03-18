package mappings

type TranslationFieldProperties struct {
	GqlField    string `json:"gqlField"`
	GoField     string `json:"goField"`
	DbField     string `json:"dbField"`
	Label       string `json:"label"`
	DataType    string `json:"dataType"`
	FormType    string `json:"formType"`
	IsOtherType bool   `json:"isOtherType,omitempty"`
}

type TranslationFieldPropertiesWithOptions struct {
	TranslationFieldProperties
	Options                 map[string]string `json:"options"`
	AllowMultipleSelections bool              `json:"allowMultipleSelections,omitempty"`
}

type TranslationFieldPropertiesWithOptionsAndParent struct {
	TranslationFieldPropertiesWithOptions
	ParentFieldName string `json:"parentFieldName"`
}
