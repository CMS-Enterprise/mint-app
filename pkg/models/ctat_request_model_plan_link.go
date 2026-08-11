package models

import "github.com/google/uuid"

// CTATRequestModelPlanLink represents a related MINT model linked to a CTAT request.
type CTATRequestModelPlanLink struct {
	baseStruct
	ctatRequestRelation
	modelPlanRelation
}

func NewCTATRequestModelPlanLinks(ctatRequestID uuid.UUID, modelPlanIDs []uuid.UUID, createdBy uuid.UUID) []*CTATRequestModelPlanLink {
	links := make([]*CTATRequestModelPlanLink, 0, len(modelPlanIDs))

	for _, modelPlanID := range modelPlanIDs {
		link := &CTATRequestModelPlanLink{}
		link.ID = uuid.New()
		link.CTATRequestID = ctatRequestID
		link.ModelPlanID = modelPlanID
		link.CreatedBy = createdBy

		links = append(links, link)
	}

	return links
}
