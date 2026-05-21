package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

//go:embed translation/waiver.json
var waiverJSON []byte

// waiverTranslation holds the field-level translations for the waiver table.
type waiverTranslation struct {
	WillUseWaiver  models.TranslationField `json:"willUseWaiver" db:"will_use_waiver"`
	NotUsingReason models.TranslationField `json:"notUsingReason" db:"not_using_reason"`
}

// TableName satisfies the Translation interface
func (t *waiverTranslation) TableName() models.TableName {
	return models.TNWaiver
}

// ToMap satisfies the Translation interface
func (t *waiverTranslation) ToMap() (map[string]models.ITranslationField, error) {
	return models.StructToTranslationMap(*t)
}

// WaiverTranslation loads the translation for the waiver table
func WaiverTranslation() (*waiverTranslation, error) {
	var translation waiverTranslation
	if err := json.Unmarshal(waiverJSON, &translation); err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
