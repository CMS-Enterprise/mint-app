package models

import (
	"testing"

	"github.com/guregu/null"
	"github.com/stretchr/testify/suite"
)

// CalcStatusSuite is the testify suite for the resolver package
type CalcStatusSuite struct {
	suite.Suite
}

// TestCalcStatusSuite runs the resolver test suite
func TestCalcStatusSuite(t *testing.T) {
	css := new(CalcStatusSuite)
	suite.Run(t, css)
}

func (suite *CalcStatusSuite) TestGenericallyCalculateStatus() {
	type TestStruct struct {
		fieldA *string `statusWeight:"1"`
		fieldC *bool   `statusWeight:"3"`
	}

	// 0/3 - Ready
	res, err := GenericallyCalculateStatus(TestStruct{})
	suite.Nil(err)
	suite.EqualValues(TaskReady, res)

	// 1/3 - In progress
	res, err = GenericallyCalculateStatus(TestStruct{
		fieldA: null.StringFrom("test").Ptr(),
		// fieldB: null.IntFrom(3).Ptr(),
		fieldC: null.BoolFrom(true).Ptr(),
	})
	suite.Nil(err)
	suite.EqualValues(TaskInProgress, res)

	// // 3/3 - Complete
	// res, err = GenericallyCalculateStatus(TestStruct{
	// 	fieldA: null.StringFrom("test").Ptr(),
	// 	fieldB: null.IntFrom(3).Ptr(),
	// 	fieldC: null.BoolFrom(true).Ptr(),
	// 	fieldD: null.NewString("", false).Ptr(),
	// 	fieldE: "",
	// 	fieldF: pq.StringArray{"test"},
	// })
	// suite.Nil(err)
	// suite.EqualValues(TaskComplete, res)
}

func (suite *CalcStatusSuite) TestGenericallyCalculateStatusNoFields() {
	// No fields have `statusWeight` set
	type TestStructNoStatusWeights struct {
		fieldA *string
		fieldB string
	}

	// 0/3 - Ready
	res, err := GenericallyCalculateStatus(TestStructNoStatusWeights{
		fieldA: null.StringFrom("test").Ptr(),
		fieldB: "test",
	})
	suite.ErrorContains(err, "no fields have the statusWeight tag")
	suite.EqualValues(TaskStatus(""), res)
}

func (suite *CalcStatusSuite) TestGenericallyCalculateStatusWrongTypes() {
	// Try adding `statusWeight` to a non-pointer type
	type TestStructNotPointer struct {
		fieldA string `statusWeight:"1"`
	}
	res, err := GenericallyCalculateStatus(TestStructNotPointer{
		fieldA: "test",
	})
	// suite.ErrorContains(err, "field fieldA is not a pointer (found string)")
	suite.ErrorContains(err, "field fieldA is not a supported type for status calculation (found string)")
	suite.EqualValues(TaskStatus(""), res)

	// Try calling with a non-struct type
	res, err = GenericallyCalculateStatus("test")
	suite.ErrorContains(err, "string is not a struct")
	suite.EqualValues(TaskStatus(""), res)

	// Try adding `statusWeight` with a non-integer type
	type TestStructNotInteger struct {
		fieldA *string `statusWeight:"1.2"`
	}
	res, err = GenericallyCalculateStatus(TestStructNotInteger{
		fieldA: null.StringFrom("test").Ptr(),
	})
	suite.ErrorContains(err, "strconv.ParseInt")
	suite.EqualValues(TaskStatus(""), res)
}
