package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/category/get_by_id_LOADER.sql
var mtoTemplateCategoryGetByIDLoaderSQL string

//go:embed SQL/mto/template/category/get_by_template_id_LOADER.sql
var mtoTemplateCategoryGetByTemplateIDLoaderSQL string

//go:embed SQL/mto/template/category/get_by_category_id_LOADER.sql
var mtoTemplateCategoryGetByCategoryIDLoaderSQL string

//go:embed SQL/mto/template/category/get_category_options.sql
var mtoTemplateCategoryGetCategoryOptionsSQL string

type mtoTemplateCategoryScripts struct {
	GetByIDLoader            string
	GetByTemplateIDLoader    string
	GetByCategoryIDLoader    string
	GetSubCategoryByIDLoader string
	GetCategoryOptions       string
}

var MTOTemplateCategory = mtoTemplateCategoryScripts{
	GetByIDLoader:         mtoTemplateCategoryGetByIDLoaderSQL,
	GetByTemplateIDLoader: mtoTemplateCategoryGetByTemplateIDLoaderSQL,
	GetByCategoryIDLoader: mtoTemplateCategoryGetByCategoryIDLoaderSQL,
	GetCategoryOptions:    mtoTemplateCategoryGetCategoryOptionsSQL,
}
