package models

import (
	"github.com/google/uuid"
)

type CTATDiscussionPoster string

const (
	CTATDiscussionPosterRequester CTATDiscussionPoster = "REQUESTER"
	CTATDiscussionPosterAdmin     CTATDiscussionPoster = "ADMIN"
)

func (c CTATDiscussionPoster) String() string {
	if c == CTATDiscussionPosterRequester {
		return "Requester"
	}

	return "Admin"
}

type CTATDiscussion struct {
	baseStruct

	TicketID   uuid.UUID            `json:"ticketID" db:"ticket_id"`
	Content    string               `json:"content" db:"content"`
	PosterRole CTATDiscussionPoster `json:"posterRole" db:"poster_role"`
}
