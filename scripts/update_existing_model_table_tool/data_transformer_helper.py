from datetime import datetime


class DataTransformerHelper:
    @staticmethod
    def transform_string(value):
        if value == '':
            return '\' \''
        else:
            sanitized_value = value.replace("'", "''")
            return f"'{sanitized_value}'"

    @staticmethod
    def transform_integer(value):
        if value == '' or value == ' ':
            return '0'
        else:
            return int(value)

    @staticmethod
    def transform_is_active(is_active):
        if is_active.lower() == "true":
            return str(True)
        else:
            return str(False)

    @staticmethod
    def transform_date(date_str):
        if date_str == '':
            return 'NULL'
        else:
            date_format = "%Y-%m-%d"
            return f"'{datetime.strptime(date_str, date_format).strftime('%Y-%m-%d %H:%M:%S%z')}'"
