package models

// CTATRequestsTableData contains the requests for the admin CTAT table.
type CTATRequestsTableData struct {
	CtatRequests []*CTATRequest `json:"ctatRequests"`
}

// Count returns the number of CTAT requests in the admin table payload.
func (d *CTATRequestsTableData) Count() int {
	if d == nil {
		return 0
	}

	return len(d.CtatRequests)
}

// CTATRequestsTableDataRequester contains the requests for the requester CTAT table.
type CTATRequestsTableDataRequester struct {
	CtatRequests []*CTATRequest `json:"ctatRequests"`
}
