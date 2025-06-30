package email

func boolToYesNo(b bool) string {
	if b {
		return "Yes"
	}
	return "No"
}

func valueOrEmpty(s *string) string {
	if s != nil {
		return *s
	}
	return ""
}
