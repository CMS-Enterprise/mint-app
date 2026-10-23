package models

import (
	"github.com/google/uuid"
)

type CTATDiscussionPoster string

const (
	CTATDiscussionPosterRequester CTATDiscussionPoster = "REQUESTER"
	CTATDiscussionPosterAdmin     CTATDiscussionPoster = "ADMIN"
)

type CTATDiscussion struct {
	baseStruct

	TicketID   uuid.UUID            `json:"ticketID" db:"ticket_id"`
	Content    string               `json:"content" db:"content"`
	PosterRole CTATDiscussionPoster `json:"posterRole" db:"poster_role"`
}

// Input for creating a CTAT Discussion
type CTATDiscussionInput struct {
	TicketID uuid.UUID `json:"ticketID" db:"ticket_id"`
	Content  string    `json:"content" db:"content"`
}
