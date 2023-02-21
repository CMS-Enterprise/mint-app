import yaml


def map_headers_to_columns(headers):
    with open('column_map.yaml') as f:
        column_map = yaml.safe_load(f)

    return [column_map.get(header, "") for header in headers]
