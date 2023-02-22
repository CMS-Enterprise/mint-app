from typing import List


class DataProcessor:
    def process_rows(self, columns: List[str], rows: List[List[str]]) -> List[dict]:
        processed_rows = []
        for row in rows:
            processed_row = {}
            for i, value in enumerate(row):
                column_name = columns[i]
                processed_row[column_name] = value
            processed_rows.append(processed_row)
        return processed_rows
