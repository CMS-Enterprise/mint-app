package sqlutils

// ExecProcedure is a wrapper function that handles the boilerplate of creating and executing a named statement
// It does not return any values, and is typically useful for DELETE statements or other statements where no return value needs to be captured.
func ExecProcedure(np NamedPreparer, sqlQuery string, arg interface{}) error {
	stmt, err := np.PrepareNamed(sqlQuery)
	if err != nil {
		return ProcessDataBaseErrors("issue preparing named statement", err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(arg)
	if err != nil {
		return ProcessDataBaseErrors("issue executing named statement", err)
	}
	return nil
}

// GetProcedure is a wrapper function that handles the boiler plate of creating and executing a returned object from the database
// Under the hood, it calls stmt.Get to return an object from the database
func GetProcedure[T any](np NamedPreparer, sqlQuery string, arg interface{}) (*T, error) {
	stmt, err := np.PrepareNamed(sqlQuery)
	if err != nil {
		return nil, ProcessDataBaseErrors("issue preparing named statement", err)
	}
	defer stmt.Close()
	var dest T

	err = stmt.Get(&dest, arg)
	if err != nil {
		return nil, ProcessDataBaseErrors("issue executing named statement", err)
	}
	return &dest, nil
}

// SelectProcedure is a wrapper function that handles the boiler plate of creating and executing a returned object from the database
// Under the hood, it calls stmt.Select to return a collection of objects
func SelectProcedure[T any](np NamedPreparer, sqlQuery string, arg interface{}) ([]*T, error) {
	stmt, err := np.PrepareNamed(sqlQuery)
	if err != nil {
		return nil, ProcessDataBaseErrors("issue preparing named statement", err)
	}
	defer stmt.Close()
	var dest []*T

	err = stmt.Select(&dest, arg)
	if err != nil {
		return nil, ProcessDataBaseErrors("issue executing named statement", err)
	}
	return dest, nil
}
