# Full Duplex Communication for Real-Time Support in the MINT application

The MINT application is currently only capable of responding to a request.
Any updates require a new request from the client. This allows the server to be stateless,
but some form of polling is necessary. By using some form of full duplex communication the client
can receive live updates for more dynamic and responsive views.

## Considered Alternatives

* Polling
* Webhooks
* GraphQL Subscriptions
* Socket.io

## Decision Outcome

> Use GraphQL Subscriptions for live data

Our codebase is highly built around GraphQL, it is natural that GraphQL Subscriptions integrates well.
A solution that pairs naturally with our current workflow minimizes time to delivery.

## Pros and Cons of the Alternatives <!-- optional -->

### Polling

* `+` Simple
* `-` Poor performance
* `-` Does not reasonably scale to live communication

### Webhooks

* `+` Good performance
* `+` Enables live communication
* `-` High development complexity

### GraphQL Subscriptions

* `+` Good performance
* `+` Enables live communication
* `-` Low ongoing development complexity
* `-` Less websocket control

### Socket.io
Note: This is a very popular utility. We may decide to integrate it with GraphQL at a later date.
      Discussions were had but spike testing was not done with Socket.io.

* `+` Simple and Powerful
* `?` Potential integration with GraphQL Subscriptions
* `-` Out of scope for current needs
