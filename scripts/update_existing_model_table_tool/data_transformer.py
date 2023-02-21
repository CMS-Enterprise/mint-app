from datetime import datetime

from data_transformer_helper import DataTransformerHelper
from id_generator import IDGenerator


class DataTransformer:
    def __init__(self, columns):
        self.columns = columns
        self.id_generator = IDGenerator()
        self.required_fields = ["model_name", "stage"]
        self.data = []

        self.transform_map = {
            "model_name": DataTransformerHelper.transform_string,
            "stage": DataTransformerHelper.transform_string,
            "number_of_participants": DataTransformerHelper.transform_string,
            "category": DataTransformerHelper.transform_string,
            "description": DataTransformerHelper.transform_string,
            "number_of_beneficiaries_impacted": DataTransformerHelper.transform_integer,
            "number_of_physicians_impacted": DataTransformerHelper.transform_integer,
            "date_began": DataTransformerHelper.transform_date,
            "date_ended": DataTransformerHelper.transform_date,
            "states": DataTransformerHelper.transform_string,
            "keywords": DataTransformerHelper.transform_string,
            "url": DataTransformerHelper.transform_string,
            "display_model_summary": DataTransformerHelper.transform_is_active,
            "id": self.transform_model_id,
        }

    def transform(self, row, created_dts, created_by):
        # Check if required fields are missing
        if not all(row.get(field) for field in self.required_fields):
            raise ValueError("Missing required field")

        # Transform the row and add the created_dts and created_by values
        row_values = []
        for column in self.columns:
            value = self.transform_value(column, row.get(column))
            row_values.append(value)
        row_values.append(created_dts)

        return row_values

    def transform_all(self, rows, created_by, created_dts):
        for row in rows:
            # Check if required fields are missing
            if not all(row.get(field) is not None for field in self.required_fields):
                missing_fields = [field for field in self.required_fields if row.get(field) is None]
                missing_fields_str = ', '.join(missing_fields)
                raise ValueError(f"Missing required field(s): {missing_fields_str}")

            # Transform the row and add the created_dts and created_by values
            row_values = []
            for column in self.columns:
                value = self.transform_value(column, row.get(column))
                row_values.append(value)

            row_values.append(DataTransformerHelper.transform_string(created_by))
            row_values.append(created_dts)
            self.data.append(row_values)

        return self.data

    def transform_value(self, column, value):
        if value is None:
            return 'NULL'
        elif column in self.transform_map:
            return self.transform_map[column](value)
        else:
            return DataTransformerHelper.transform_string(value)

    def transform_model_id(self, model_id):
        # Generate an ID if one is not provided
        if not model_id:
            model_id = self.id_generator.generate_new_id()

        if model_id == '':
            return self.id_generator.generate_new_id()
        else:
            return str(self.id_generator.generate_unique_id(model_id))
