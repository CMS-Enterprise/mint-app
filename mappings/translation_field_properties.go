package mappings

type TranslationFieldProperties struct {
	GqlField      string `json:"gqlField"`
	GoField       string `json:"goField"`
	DbField       string `json:"dbField"`
	Label         string `json:"label"`
	ReadOnlyLabel string `json:"readonlyLabel"`
	SubLabel      string `json:"sublabel"`
	DataType      string `json:"dataType"`
	FormType      string `json:"formType"`
	IsOtherType   bool   `json:"isOtherType,omitempty"`
}

// GetLabel has logic to prioritize the translated label to be returned for a specific field. It prioritizes the Read only Label, a
func (tfp TranslationFieldProperties) GetLabel() string {
	if tfp.ReadOnlyLabel != "" {
		return tfp.ReadOnlyLabel
	}

	return tfp.Label

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
