package mappings

import "github.com/cmsgov/mint-app/pkg/models"

// Translation defines the signature every translation is expected to have
type Translation interface {
	TableName() models.TableName
	ToMap() (map[string]models.ITranslationField, error)
}
