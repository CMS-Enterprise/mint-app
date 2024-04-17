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
	translationNoParentRelation
	translationNoChildRelation
}

// isTranslationParent fulfills the ITranslationParent interface
func (tf TranslationField) isTranslationParent() {}

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
	OtherParentField *string `json:"otherParentField"`
	// Label for fields that reference more than one parent - Ex: Notes - 'Note for Model Basics'
	ParentReferencesLabel *string `json:"parentReferencesLabel"`
}

// GetLabel has logic to prioritize the translated label to be returned for a specific field. It prioritizes the Read only Label, a
func (tfb TranslationFieldBase) GetLabel(translationDictionary map[string]ITranslationField) string {
	/*
		1. Favor Export Label --> ReadOnlyLabel --> Label

		2. Any IsOther, or IsNote Translation
			a. Prioritize ParentReferencesLabel
				i.
			b. Use Other ParentField to get the parent translation if needed

	*/

	if tfb.ReadOnlyLabel != nil {
		return *tfb.ReadOnlyLabel
	}

	return tfb.Label

}

// TranslationFieldWithOptions Represents a TranslationField that has options
type TranslationFieldWithOptions struct {
	TranslationFieldBase
	translationOptionRelation
	translationNoParentRelation
	translationNoChildRelation
}

// ITranslationField defines the signature every translation is expected to have
type ITranslationField interface {
	GetLabel(translationDictionary map[string]ITranslationField) string
	HasOptions() bool
	// Returns options if a translationField has options
	GetOptions() (map[string]interface{}, bool)

	HasParent() bool
	GetParent() (ITranslationParent, bool)

	HasChildren() bool
	GetChildren() (map[string][]TranslationField, bool)
	//Changes: (Translations) Note, the children could be other types (Eg with options, or with parent), but this allows us to have a typed deserialization
}

//Changes: (Translations) Define the Translation Parent better

// ITranslationParent is the shared interface for translations that have some sort of parent
type ITranslationParent interface {
	isTranslationParent()
}

// translationNoParentRelation can be embedded for translations that don't have a parent
type translationNoParentRelation struct {
}

func (tpr translationNoParentRelation) HasParent() bool {
	return false
}
func (tpr translationNoParentRelation) GetParent() (ITranslationParent, bool) {
	return nil, tpr.HasParent()
}

// translationNoChildRelation can be embedded for translations that don't have children
type translationNoChildRelation struct {
}

func (tcr translationNoChildRelation) HasChildren() bool {
	return false
}
func (tcr translationNoChildRelation) GetChildren() (map[string][]TranslationField, bool) {
	return nil, tcr.HasChildren()
}

// TranslationFieldWithParent Represents a TranslationField that has a parent
type TranslationFieldWithParent struct {
	TranslationFieldBase
	translationOptionRelation
	translationParentRelation
	translationNoChildRelation
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
	TranslationFieldBase
	translationOptionRelation
	// Changes: (Translations) Determine how to use child relation
	translationChildRelation
	translationNoParentRelation
}

// isTranslationParent fulfills the ITranslationParent interface
func (tf TranslationFieldWithOptionsAndChildren) isTranslationParent() {}

// translationChildRelation is struct that is mean to be embedded in other Translation types to expose functionality for translations that have a Child relationships
type translationChildRelation struct {
	ChildRelation map[string][]TranslationField `json:"childRelation"`
	// Changes: (Translations) The child relation is a map of child questions connected to options
	// Example key is yes, so the children are other translation fields
}

func (tcr translationChildRelation) HasChildren() bool {
	return true
}
func (tcr translationChildRelation) GetChildren() (map[string][]TranslationField, bool) {
	return tcr.ChildRelation, tcr.HasChildren()
}

// translationParentRelation is struct that is mean to be embedded in other Translation types to expose functionality for translations that have a Parent
type translationParentRelation struct {
	ParentRelation TranslationField `json:"parentRelation"`
}

// HasParent returns if the translation has a parent, and satisfies the ITranslation interface
func (tpr translationParentRelation) HasParent() bool {
	return true
}

// GetParent returns the parent of a translation
func (tpr translationParentRelation) GetParent() (ITranslationParent, bool) {
	return tpr.ParentRelation, tpr.HasParent()
}

// translationParentRelation is struct that is mean to be embedded in other Translation types to expose functionality for translations that have a Parent
type translationParentRelationWithOptionsAndChildren struct {
	// Changes: (Structure) Figure out if we can make the parent relation structure match better? For now, making a separate implementation
	ParentRelation TranslationFieldWithOptionsAndChildren `json:"parentRelation"`
}

// TranslationFieldWithOptionsAndParent is a translation field that has Options and a Parent
type TranslationFieldWithOptionsAndParent struct {
	TranslationFieldBase
	translationOptionRelation
	translationParentRelationWithOptionsAndChildren
	translationNoChildRelation
}

// TranslationFieldWithParentAndChildren is a translation field that has a Parent and Children
type TranslationFieldWithParentAndChildren struct {
	TranslationFieldBase
	translationOptionRelation
	translationParentRelationWithOptionsAndChildren
	translationChildRelation
}

// HasParent returns if the translation has a parent, and satisfies the ITranslation interface
func (tpr TranslationFieldWithParentAndChildren) HasParent() bool {
	return true
}

// GetParent returns the parent of a translation
func (tpr TranslationFieldWithParentAndChildren) GetParent() (ITranslationParent, bool) {
	return tpr.ParentRelation, tpr.HasParent()
}

// HasParent returns if the translation has a parent, and satisfies the ITranslation interface
func (tpr TranslationFieldWithOptionsAndParent) HasParent() bool {
	return true
}

// GetParent returns the parent of a translation
func (tpr TranslationFieldWithOptionsAndParent) GetParent() (ITranslationParent, bool) {
	return tpr.ParentRelation, tpr.HasParent()
}
