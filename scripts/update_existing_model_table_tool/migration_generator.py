from datetime import datetime
from typing import List

import pytz

from csv_reader import CSVReader
from data_processor import DataProcessor
from data_transformer import DataTransformer
from header_column_mapping import map_headers_to_columns


class MigrationGenerator:
    TRUNCATE_QUERY = "-- Delete all rows from public.existing_model\nTRUNCATE public.existing_model;\n\n"

    def __init__(self, file_path, header_row_index=0):
        self.csvReader = CSVReader()
        self.csvReader.init(file_path, header_row_index)
        self.dataProcessor = DataProcessor()
        self.created_by = '00000001-0001-0001-0001-000000000001'
        self.created_dts = f"'{datetime.now(pytz.utc)}'"

    def generate_migration(self):
        headers, rows = self.csvReader.read()
        columns = map_headers_to_columns(headers)
        transformed_data = self.transform_data(columns, rows)
        return self.generate_migration_content(columns, transformed_data)

    def transform_data(self, columns: List[str], rows: List[List[str]]) -> List[List[str]]:
        processed_rows = self.dataProcessor.process_rows(columns, rows)
        transformer = DataTransformer(columns)
        transformed_data = transformer.transform_all(processed_rows, self.created_by, self.created_dts)
        return transformed_data

    def generate_migration_content(self, columns, rows):
        if rows:
            columns_str = ", ".join(columns + ["created_by", "created_dts"])
            values_str = ",\n".join(f"({', '.join(map(str, row_values))})" for row_values in rows)
            migration = self.TRUNCATE_QUERY
            migration += "-- Insert all new rows to public.existing_model\n"
            migration += f"INSERT INTO public.existing_model ({columns_str}) VALUES\n{values_str};\n"
            return migration
        else:
            return ""
