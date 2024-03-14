/*********
*  Delete all notifications and activities since they are not currently in use, and we changed the meta data structure for tagged activities 
**********/
DELETE FROM user_notification;

DELETE FROM activity;
