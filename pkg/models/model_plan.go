package models

import (
	"database/sql/driver"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// ModelPlan is the top-level object for an entire draft model plan
type ModelPlan struct {
	ID            uuid.UUID      `json:"id" db:"id"`
	ModelName     string         `json:"modelName" db:"model_name"`
	ModelCategory *ModelCategory `json:"modelCategory" db:"model_category"`
	CMSCenters    CMSArray       `json:"cmsCenters" db:"cms_centers"`
	CMSOther      *string        `json:"cmsOther" db:"cms_other"`
	CMMIGroups    pq.StringArray `json:"cmmiGroups" db:"cmmi_groups"`
	Archived      bool           `json:"archived" db:"archived"`
	Status        ModelStatus    `json:"status" db:"status"`
	CreatedBy     string         `json:"createdBy" db:"created_by"`
	CreatedDts    time.Time      `json:"createdDts" db:"created_dts"`
	ModifiedBy    *string        `json:"modifiedBy" db:"modified_by"`
	ModifiedDts   *time.Time     `json:"modifiedDts" db:"modified_dts"`
}

//CMSArray is an array of CMSCenter
type CMSArray []CMSCenter

// GetModelTypeName returns a string name that represents the ModelPlan struct
func (m ModelPlan) GetModelTypeName() string {
	return "Model_Plan"
}

// GetPlanID returns the ModifiedBy property for a ModelPlan struct
func (m ModelPlan) GetPlanID() uuid.UUID {
	return m.ID
}

// GetModifiedBy returns the ModifiedBy property for a ModelPlan struct
func (m ModelPlan) GetModifiedBy() *string {
	return m.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (m ModelPlan) GetCreatedBy() string {
	return m.CreatedBy
}

//Scan is used by sql.scan to read the values from the DB
func (a *CMSArray) Scan(src interface{}) error {
	return GenericScan(src, a)
	// return GenericScan[CMSArray, CMSCenter](src, a)
}

// func (a *CMSArray) scanBytes(src []byte) error {
// 	elems, err := scanLinearArray(src, []byte{','}, "StringArray")
// 	if err != nil {
// 		return err
// 	}
// 	if *a != nil && len(elems) == 0 {
// 		*a = (*a)[:0]
// 	} else {
// 		b := make(CMSArray, len(elems))
// 		for i, v := range elems {
// 			if b[i] = CMSCenter(v); v == nil {
// 				return fmt.Errorf("pq: parsing array element index %d: cannot convert nil to string", i)
// 			}
// 		}
// 		*a = b
// 	}
// 	return nil
// }
func scanLinearArray(src, del []byte, typ string) (elems [][]byte, err error) {
	dims, elems, err := parseArray(src, del)
	if err != nil {
		return nil, err
	}
	if len(dims) > 1 {
		return nil, fmt.Errorf("pq: cannot convert ARRAY%s to %s", strings.Replace(fmt.Sprint(dims), " ", "][", -1), typ)
	}
	return elems, err
}

// Value implements the driver.Valuer interface.
func (a CMSArray) Value() (driver.Value, error) {
	return GenericValue(a)
	// return GenericValue[CMSArray, CMSCenter](a)
	// if a == nil {
	// 	return nil, nil
	// }

	// if n := len(a); n > 0 {
	// 	// There will be at least two curly brackets, 2*N bytes of quotes,
	// 	// and N-1 bytes of delimiters.
	// 	b := make([]byte, 1, 1+3*n)
	// 	b[0] = '{'

	// 	b = appendArrayQuotedBytes(b, []byte(a[0]))
	// 	for i := 1; i < n; i++ {
	// 		b = append(b, ',')
	// 		b = appendArrayQuotedBytes(b, []byte(a[i]))
	// 	}

	// 	return string(append(b, '}')), nil
	// }

	// return "{}", nil
}

// func appendArrayQuotedBytes(b, v []byte) []byte {
// 	b = append(b, '"')
// 	for {
// 		i := bytes.IndexAny(v, `"\`)
// 		if i < 0 {
// 			b = append(b, v...)
// 			break
// 		}
// 		if i > 0 {
// 			b = append(b, v[:i]...)
// 		}
// 		b = append(b, '\\', v[i])
// 		v = v[i+1:]
// 	}
// 	return append(b, '"')
// }

// 	source, ok := src.([]byte)
// 	if !ok {
// 		return errors.New("type assertion .([]byte) failed")
// 	}
// 	pqArr := pq.StringArray{}
// 	err := json.Unmarshal(source, &pqArr)
// 	if err != nil {
// 		return err
// 	}

// 	new := ConvertEnums[CMSCenter](pqArr)
// 	*array = new

// 	return err
// 	// var i interface{}
// 	// err := json.Unmarshal(source, &i)
// 	// if err != nil {
// 	// 	return err
// 	// }
// 	// *array, ok = i.([]CMSCenter)
// 	// if !ok {
// 	// 	return errors.New("type assertion .(map[string]interface{}) failed")
// 	// }
// 	// return ok

// }
