package models

// TranslationField represents a the translation of data to human readable format
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

// HasOptions specifies if a translation field has options or not
func (tf TranslationField) HasOptions() bool {
	return false
}

// GetOptions returns options for a translation. It re
func (tf TranslationField) GetOptions() (map[string]interface{}, bool) {
	return nil, tf.HasOptions()
}

// TranslationFieldWithOptions Represents a TranslationField that has options
type TranslationFieldWithOptions struct {
	TranslationField
	Options map[string]interface{} `json:"options"`
	// AllowMultipleSelections bool              `json:"allowMultipleSelections,omitempty"`
}

// GetLabel implements the GetLabel function of the ITranslationField interface
func (tfo TranslationFieldWithOptions) GetLabel() string {
	return tfo.TranslationField.GetLabel()
}

// HasOptions specifies if a translation field has options or not
func (tfo TranslationFieldWithOptions) HasOptions() bool {
	return true
}

// ITranslationField defines the signature every translation is expected to have
type ITranslationField interface {
	GetLabel() string
	HasOptions() bool
	// Returns options if a translationField has options
	GetOptions() (map[string]interface{}, bool)
}

// GetOptions returns options for a translation
func (tfo TranslationFieldWithOptions) GetOptions() (map[string]interface{}, bool) {
	return tfo.Options, tfo.HasOptions()
}
