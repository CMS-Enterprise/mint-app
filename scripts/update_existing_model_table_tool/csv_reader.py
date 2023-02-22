import csv
from typing import Dict, List, Tuple

class CSVReader:
    def init(self, file_path, header_row_index=0):
        self.file_path = file_path
        self.header_row_index = header_row_index
        self.headers = None
        self.cache = None

    def read(self) -> Tuple[List[str], List[Dict[str, str]]]:
        if self.cache is None:
            try:
                reader = self._open_file()
                self.headers = self._extract_headers(reader)
                self.cache = self._extract_rows(reader)
            except Exception as e:
                raise ValueError(f"Error reading CSV file {self.file_path}: {e}")

        return self.headers, self.cache

    def _open_file(self) -> csv.reader:
        try:
            file = open(self.file_path, "r", encoding="utf-8-sig")
            return csv.reader(file)
        except Exception as e:
            raise ValueError(f"Error opening CSV file {self.file_path}: {e}")

    def _extract_headers(self, reader: csv.reader) -> List[str]:
        try:
            headers = next(reader, None)
            if self.header_row_index:
                headers = next(reader, None)
            if not headers:
                raise ValueError("Header row is missing")
            return headers
        except Exception as e:
            raise ValueError(f"Error extracting headers from CSV file: {e}")

    def _extract_rows(self, reader: csv.reader) -> List[Dict[str, str]]:
        try:
            rows = []
            for row in reader:
                rows.append(row)
            return rows
        except Exception as e:
            raise ValueError(f"Error extracting rows from CSV file: {e}")
