package content

// Loader is a content provisioning interface intended to decouple consumption from source
type Loader interface {
	Load() error
	Reset() error
	Get(key string) (string, error)
	GetAll() map[string]string
}
