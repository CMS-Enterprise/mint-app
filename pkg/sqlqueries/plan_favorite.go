package sqlqueries

import _ "embed"

//go:embed SQL/plan_favorite/create.sql
var planFavoriteCreateSQL string

//go:embed SQL/plan_favorite/delete.sql
var planFavoriteDeleteSQL string

//go:embed SQL/plan_favorite/get.sql
var planFavoriteGetSQL string

//go:embed SQL/plan_favorite/get_collection_by_user_id.sql
var planFavoriteGetCollectionByUserIDSQL string

//go:embed SQL/plan_favorite/get_unique_user_id.sql
var planFavoriteGetUniqueUserIDsSQL string

type planFavoriteScripts struct {
	Create                string
	Delete                string
	Get                   string
	GetCollectionByUserID string
	GetUniqueUserIDs      string
}

// PlanFavorite houses all the sql for getting data for plan favorite from the database
var PlanFavorite = planFavoriteScripts{
	Create:                planFavoriteCreateSQL,
	Delete:                planFavoriteDeleteSQL,
	Get:                   planFavoriteGetSQL,
	GetCollectionByUserID: planFavoriteGetCollectionByUserIDSQL,
	GetUniqueUserIDs:      planFavoriteGetUniqueUserIDsSQL,
}
