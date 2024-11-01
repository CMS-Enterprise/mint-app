package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// StringPointer returns a pointer to a string input
func StringPointer(st string) *string {
	return &st
}

// BoolPointer returns a pointer to a bool input
func BoolPointer(value bool) *bool {
	return &value
}

// IntPointer returns a pointer to a bool input
func IntPointer(val int) *int {
	return &val
}

// DiscussionUserRolePointer returns a pointer to a DiscussionUserRole input
func DiscussionUserRolePointer(role DiscussionUserRole) *DiscussionUserRole {
	return &role
}

// ValueOrEmpty returns a string if the input is not nil, otherwise returns an empty string
func ValueOrEmpty(st *string) string {
	if st != nil {
		return *st
	}
	return ""
}

// UUIDValueOrEmpty returns a string if the input is not nil, otherwise returns an empty string
func UUIDValueOrEmpty(uuid *uuid.UUID) string {
	if uuid != nil {
		return uuid.String()
	}
	return ""
}

// ConvertEnums converts a pq.StringArray to specific, castable type
func ConvertEnums[EnumType ~string](pqGroups pq.StringArray) []EnumType {
	enumValues := []EnumType{}
	for _, item := range pqGroups {
		enumValues = append(enumValues, EnumType(item))
	}
	return enumValues
}

// ConvertEnumsToStringArray converts an enum array to a pq.StringArray
func ConvertEnumsToStringArray[EnumType ~string](arr []EnumType) pq.StringArray {
	sa := make(pq.StringArray, len(arr))
	for i, r := range arr {
		sa[i] = string(r)
	}

	return sa
}
