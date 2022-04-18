package models

func StringPointer(st string) *string {
	return &st
}

func ValueOrEmpty(st *string) string {
	if st != nil {
		return *st
	}
	return ""
}
