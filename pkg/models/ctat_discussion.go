package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

type CTATDiscussionPoster string

const (
	CTATDiscussionPosterRequester CTATDiscussionPoster = "REQUESTER"
	CTATDiscussionPosterAdmin     CTATDiscussionPoster = "ADMIN"
)

type CTATDiscussion struct {
	ID                   uuid.UUID                  `json:"id" db:"id"`
	TicketID             uuid.UUID                  `json:"ticketID" db:"ticketID"`
	Content              string                     `json:"content" db:"content"`
	PosterRole           CTATDiscussionPoster       `json:"posterRole" db:"posterRole"`
	CreatedBy            uuid.UUID                  `json:"createdBy" db:"createdBy"`
	CreatedByUserAccount authentication.UserAccount `json:"createdByUserAccount" db:"createdByUserAccount"`
	CreatedDts           time.Time                  `json:"createdDts" db:"createdDts"`
}

// Input for creating a CTAT Discussion
type CTATDiscussionInput struct {
	TicketID uuid.UUID `json:"ticketID" db:"ticket_id"`
	Content  string    `json:"content" db:"content"`
}
