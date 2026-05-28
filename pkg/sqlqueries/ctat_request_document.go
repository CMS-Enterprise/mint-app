package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request_document/get_by_ctat_request_id_LOADER.sql
var ctatRequestDocumentsByCTATRequestIDSQL string

type ctatRequestDocumentScripts struct {
	GetByCTATRequestID string
}

var CTATRequestDocument = ctatRequestDocumentScripts{
	GetByCTATRequestID: ctatRequestDocumentsByCTATRequestIDSQL,
}
