import csv
import pytz
from datetime import datetime
from data_transformer import DataTransformer
from header_column_mapping import map_headers_to_columns


class MigrationGenerator:
    TRUNCATE_QUERY = "-- Delete all rows from public.existing_model\nTRUNCATE public.existing_model;\n\n"

    def __init__(self, file_path, header_row_index=0):
        self.file_path = file_path
        self.header_row_index = header_row_index
        self.created_dts = f"'{datetime.now(pytz.utc)}'"

    def generate_migration(self):
        # Open the file and read the CSV data
        with open(self.file_path, "r", encoding="utf-8-sig") as file:
            reader = csv.reader(file)
            headers = next(reader, None)
            if self.header_row_index:
                headers = next(reader, None)

            # Initialize the DataTransformer with the headers
            transformer = DataTransformer(headers)

            # Read each row and transform the data
            columns = map_headers_to_columns(headers)
            transformer = DataTransformer(columns)
            new_rows = []
            for row in reader:
                row_dict = {map_headers_to_columns([h])[0]: v for h, v in zip(headers, row)}
                new_rows.append(row_dict)
            transformed_data = transformer.transform_all(new_rows, "TOOL", self.created_dts)

        # Generate the INSERT statement for the transformed data
        if transformed_data:
            columns = transformer.columns + ["created_by", "created_dts"]
            columns_str = ", ".join(columns)
            values_str = ",\n".join(f"({', '.join(map(str, row_values))})" for row_values in transformed_data)
            migration = self.TRUNCATE_QUERY
            migration += "-- Insert all new rows to public.existing_model\n"
            migration += f"INSERT INTO public.existing_model ({columns_str}) VALUES\n{values_str};\n"
            return migration
        else:
            return ""
