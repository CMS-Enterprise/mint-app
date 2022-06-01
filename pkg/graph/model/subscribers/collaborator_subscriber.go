package subscribers

/*import "github.com/cmsgov/mint-app/pkg/graph/model"

type CollaboratorSubscriber struct {
	ID      string
	Channel chan *model.CollaboratorChanged
}

func NewCollaboratorSubscriber(ID string) *CollaboratorSubscriber {
	return &CollaboratorSubscriber{ID: ID, Channel: make(chan *model.CollaboratorChanged)}
}

func (c CollaboratorSubscriber) GetID() string {
	return c.ID
}

func (c CollaboratorSubscriber) GetChannel() <-chan *model.CollaboratorChanged {
	return c.Channel
}

func (c CollaboratorSubscriber) Notify(payload interface{}) {
	typedPayload := payload.(*model.CollaboratorChanged)
	c.Channel <- typedPayload
}*/
