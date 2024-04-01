package models

// TranslationField represents a the translation of data to human readble format
type TranslationField struct {
	GqlField         string  `json:"gqlField"`
	GoField          string  `json:"goField"`
	DbField          string  `json:"dbField"`
	Label            string  `json:"label"`
	ReadOnlyLabel    *string `json:"readonlyLabel"`
	SubLabel         *string `json:"sublabel"`
	MultiSelectLabel *string `json:"multiSelectLabel"`
	IsArray          bool    `json:"isArray"`
	IsOtherType      bool    `json:"isOtherType"`
	// DataType         string `json:"dataType"`
	// FormType    string `json:"formType"`

}

// GetLabel has logic to prioritize the translated label to be returned for a specific field. It prioritizes the Read only Label, a
func (tf TranslationField) GetLabel() string {
	if tf.ReadOnlyLabel != nil {
		return *tf.ReadOnlyLabel
	}

	return tf.Label

}

// TranslationFieldWithOptions Represents a TranslationField that has options
type TranslationFieldWithOptions struct {
	TranslationField
	Options map[string]interface{} `json:"options"`
	// AllowMultipleSelections bool              `json:"allowMultipleSelections,omitempty"`
}
