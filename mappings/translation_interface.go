package mappings

// Translation defines the signature every translation is expected to have
type Translation interface {
	TableName() string
	ToMap() (map[string]interface{}, error)
}
