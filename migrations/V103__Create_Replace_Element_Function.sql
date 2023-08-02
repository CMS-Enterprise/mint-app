CREATE OR REPLACE FUNCTION replace_element(arr anyarray, old_val anyelement, new_val anyelement)
  RETURNS anyarray AS
$$
DECLARE
  i integer;
BEGIN
  FOR i in 1 .. array_length(arr, 1) LOOP
      IF arr[i] = old_val THEN
        arr[i] := new_val;
      END IF;
    END LOOP;
  RETURN arr;
END;
$$
  LANGUAGE plpgsql;
