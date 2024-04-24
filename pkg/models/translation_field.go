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
	// Labels specifically for export/change history.  Takes priority over all other labels
	ExportLabel *string `json:"exportLabel"`
}

// GetLabel has logic to prioritize the translated label to be returned for a specific field. It prioritizes the Export only Label, then the parent label, then label
func (tfb TranslationFieldBase) GetLabel() string {
	//Changes: (Translations) Should GetLabel return an error ever?
	/*1. Favor Export Label  */
	if tfb.ExportLabel != nil {
		return *tfb.ExportLabel
	}
	// Changes: (Translations) Verify the priority for labels? Read only sometimes has language that isn't correct for this.
	return tfb.Label

}
func (tfb TranslationFieldBase) GetReferencesLabel(translationDictionary map[string]ITranslationField) *string {
	if tfb.ParentReferencesLabel != nil {
		return tfb.ParentReferencesLabel
	}
	if tfb.OtherParentField != nil {
		// Attempt to get the parent field, and it's label (with recursion?) If not, fall through to the other labels.
		parent, ok := translationDictionary[*tfb.OtherParentField]
		if ok {
			parentLabel := parent.GetLabel()
			return &parentLabel
			// Changes: (Translations) verify that this is ok, we are opening ourselves up to recursion using this method call...
		}
	}
	return nil

}

// GetFormType returns the form type of a translation
func (tfb TranslationFieldBase) GetFormType() TranslationFormType {
	return tfb.FormType
}

// GetDataType returns the data type of a translation
func (tfb TranslationFieldBase) GetDataType() TranslationDataType {
	return tfb.DataType
}

// GetQuestionType returns the question type of a translation
// Currently, it will return not if a note, or other if an other (priority given to note)
// If neither of the above, it will return nil
func (tfb TranslationFieldBase) GetQuestionType() *TranslationQuestionType {
	if tfb.IsNote {
		note := TFTNote
		return &note
	}
	if tfb.IsOtherType {
		other := TFTOther
		return &other
	}
	return nil

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
	// Returns the label directly for the field without reference to a parent.
	GetLabel() string
	GetReferencesLabel(map[string]ITranslationField) *string

	HasOptions() bool
	// Returns options if a translationField has options
	GetOptions() (map[string]interface{}, bool)

	HasParent() bool
	GetParent() (ITranslationParent, bool)

	GetFormType() TranslationFormType
	GetDataType() TranslationDataType

	HasChildren() bool
	GetChildren() (map[string][]TranslationField, bool)
	//Changes: (Translations) Note, the children could be other types (Eg with options, or with parent), but this allows us to have a typed deserialization

	GetQuestionType() *TranslationQuestionType
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
