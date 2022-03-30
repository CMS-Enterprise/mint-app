create domain eua_id as text
   constraint check_valid_eua_id check (
		/*value is not null and*/
		value ~ '^[A-Z0-9]{4}$'
	);
