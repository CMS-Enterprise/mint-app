# Notification Architecture choices

**User Story:** [EASI-3294](https://jiraent.cms.gov/browse/EASI-3294)

As we look to implement in app notifications for the MINT application, it is important to consider the architecture we will implement to support this.

The main driving forces are simplicity, data integrity, and extensibility. Notifications can be thought to follow a publication subscription system, where an event (or activity) is published to the database, and depending on a users preferences (subscriptions), they receive a notification. The current use case in MINT doesn't call for a delivery system and an extremely genericized publication subscription architecture, BUT we can use that general paradigm when designing the architecture. 


To experiment with this, a proof of concept branch was created, [EASI-3294/notifications_poc](https://github.com/CMS-Enterprise/mint-app/tree/EASI-3294/notifications_poc). Paradigm choices discovered in that branch are documented here.


## Decision Outcome

### Schema
To persist the idea of notification in the database, we can implement three tables. 

#### Activity
  This table will hold all information regarding the event that took place. This allows flexibility and normalization of data. The table will hold information regarding, the actor who took the activity, the entity the activity is regarding, and any other meta data that is necessary to know.

#### User Notification
  This table will hold a per user reference to an activity, based on a user preferences. (See the User Notification Preferences Table below). These notification records will also be the place a notification is marked as read or unread.


#### User Notification Preferences
  This table will hold the users preferences about the types of notifications they want to receive, and in what format. For each notification type, there will be a column that represents if they want to receive notifications in each available format (currently in app, and email). When an activity is created, notifications will be written to the table after consulting this notification preferences object.


### Business Logic
  As much as possible, logic will be separated into discrete packages. The exact structure will be determined when the code is implemented. As a principle, notifications will be treated as their own responsibility. When an activity is created, it will also call all the logic to create notifications. Methods to create notifications will not be exported.
