package mappings

import "github.com/cms-enterprise/mint-app/pkg/models"

// Translation defines the signature every translation is expected to have
type Translation interface {
	TableName() models.TableName
	ToMap() (map[string]models.ITranslationField, error)
}
