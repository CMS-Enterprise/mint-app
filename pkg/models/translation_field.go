package models

// Represents the data type of the translation field
type TranslationDataType string

// These constants represent the different values of TranslationDataType
const (
	TDTString  TranslationDataType = "STRING"
	TDTNumber  TranslationDataType = "NUMBER"
	TDTBoolean TranslationDataType = "BOOLEAN"
	TDTDate    TranslationDataType = "DATE"
	TDTEnum    TranslationDataType = "ENUM"
	TDTObject  TranslationDataType = "OBJECT"
)

// Represents the FORM type of the translation field
type TranslationFormType string

// These constants represent the different values of TranslationFormType
const (
	TFTText        TranslationFormType = "TEXT"
	TFTTextarea    TranslationFormType = "TEXTAREA"
	TFTNumber      TranslationFormType = "NUMBER"
	TFTBoolean     TranslationFormType = "BOOLEAN"
	TFTRadio       TranslationFormType = "RADIO"
	TFTCheckbox    TranslationFormType = "CHECKBOX"
	TFTSelect      TranslationFormType = "SELECT"
	TFTMultiselect TranslationFormType = "MULTISELECT"
	TFTDatePicker  TranslationFormType = "DATEPICKER"
	TFTRangeInput  TranslationFormType = "RANGEINPUT"
)

// TranslationField represents a the translation of data to human readable format
type TranslationField struct {
	TranslationFieldBase
	translationNoOptionRelation
}
type TranslationFieldBase struct {
	GqlField         string              `json:"gqlField"`
	GoField          string              `json:"goField"`
	DbField          string              `json:"dbField"`
	Label            string              `json:"label"`
	ReadOnlyLabel    *string             `json:"readonlyLabel"`
	SubLabel         *string             `json:"sublabel"`
	MultiSelectLabel *string             `json:"multiSelectLabel"`
	IsArray          bool                `json:"isArray"`
	DataType         TranslationDataType `json:"dataType"`
	FormType         TranslationFormType `json:"formType"`
	IsNote           bool                `json:"isNote"`
	IsOtherType      bool                `json:"isOtherType"`
	// DB field name for the parent field, used to be able to grab the parent translation
	OtherParentField string `json:"otherParentField"`
	// Label for fields that reference more than one parent - Ex: Notes - 'Note for Model Basics'
	ParentReferencesLabel string `json:"parentReferencesLabel"`
}

// GetLabel has logic to prioritize the translated label to be returned for a specific field. It prioritizes the Read only Label, a
func (tfb TranslationFieldBase) GetLabel() string {
	if tfb.ReadOnlyLabel != nil {
		return *tfb.ReadOnlyLabel
	}

	return tfb.Label

}

// // HasOptions specifies if a translation field has options or not
// func (tf TranslationField) HasOptions() bool {
// 	return false
// }

// // GetOptions returns options for a translation. It re
// func (tf TranslationField) GetOptions() (map[string]interface{}, bool) {
// 	return nil, tf.HasOptions()
// }

// TranslationFieldWithOptions Represents a TranslationField that has options
type TranslationFieldWithOptions struct {
	TranslationFieldBase
	translationOptionRelation
	// Options map[string]interface{} `json:"options"`
	// AllowMultipleSelections bool              `json:"allowMultipleSelections,omitempty"`
}

// // GetLabel implements the GetLabel function of the ITranslationField interface
// func (tfo TranslationFieldWithOptions) GetLabel() string {
// 	return tfo.TranslationField.GetLabel()
// }

// // HasOptions specifies if a translation field has options or not
// func (tfo TranslationFieldWithOptions) HasOptions() bool {
// 	return true
// }
// // GetOptions returns options for a translation
// func (tfo TranslationFieldWithOptions) GetOptions() (map[string]interface{}, bool) {
// 	return tfo.Options, tfo.HasOptions()
// }

// ITranslationField defines the signature every translation is expected to have
type ITranslationField interface {
	GetLabel() string
	HasOptions() bool
	// Returns options if a translationField has options
	GetOptions() (map[string]interface{}, bool)
}

// TranslationFieldWithParent Represents a TranslationField that has a parent
type TranslationFieldWithParent struct {
	TranslationField
	translationOptionRelation
	translationParentRelation
	// ParentRelation TranslationField `json:"parentRelation"`
	// Options        map[string]interface{} `json:"options"`
}

// translationOptionRelation is struct that is mean to be embedded in other Translation types to expose options, and functionality of options
type translationOptionRelation struct {
	Options map[string]interface{} `json:"options"`
}

// HasOptions specifies if a translation field has options or not
func (tor translationOptionRelation) HasOptions() bool {
	return true
}

// GetOptions returns options for a translation
func (tor translationOptionRelation) GetOptions() (map[string]interface{}, bool) {
	return tor.Options, tor.HasOptions()
}

// translationNoOptionRelation is struct that is mean to be embedded in other Translation types to satisfy the ITranslation, and functionality of translations that don't have options
type translationNoOptionRelation struct {
}

// HasOptions specifies if a translation field has options or not
func (tor translationNoOptionRelation) HasOptions() bool {
	return false
}

// GetOptions returns options for a translation
func (tor translationNoOptionRelation) GetOptions() (map[string]interface{}, bool) {
	return nil, tor.HasOptions()
}

// TranslationFieldWithOptionsAndChildren Represents a TranslationField that has options and Children
type TranslationFieldWithOptionsAndChildren struct {
	TranslationField
	translationOptionRelation
	// Changes: (Translations) Determine how to use child relation
	translationChildRelation
	// ChildRelation map[string]interface{} `json:"childRelation"`
	// Options       map[string]interface{} `json:"options"`
}

// translationChildRelation is struct that is mean to be embedded in other Translation types to expose functionality for translations that have a Child relationships
type translationChildRelation struct {
	ChildRelation map[string]interface{} `json:"childRelation"`
}

// translationParentRelation is struct that is mean to be embedded in other Translation types to expose functionality for translations that have a Parent
type translationParentRelation struct {
	ParentRelation TranslationField `json:"parentRelation"`
}

// translationParentRelation is struct that is mean to be embedded in other Translation types to expose functionality for translations that have a Parent
type translationParentRelationWithOptionsAndChildren struct {
	// Changes: (Structure) Figure out if we can make the parent relation structure match better? For now, making a separate implementation
	ParentRelation TranslationFieldWithOptionsAndChildren `json:"parentRelation"`
}

// TranslationFieldWithOptionsAndParent is a translation field that has Options and a Parent
type TranslationFieldWithOptionsAndParent struct {
	TranslationField
	translationOptionRelation
	translationParentRelationWithOptionsAndChildren
}

// TranslationFieldWithParentAndChildren is a translation field that has a Parent and Children
type TranslationFieldWithParentAndChildren struct {
	TranslationField
	translationOptionRelation
	translationParentRelationWithOptionsAndChildren
	translationChildRelation
}
