package models

// StringPointer returns a pointer to a string input
func StringPointer(st string) *string {
	return &st
}

// ValueOrEmpty returns a string if the input is not nil, otherwise returns an empty string
func ValueOrEmpty(st *string) string {
	if st != nil {
		return *st
	}
	return ""
}
