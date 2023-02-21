class IDGenerator:
    def __init__(self):
        self.no_id_instances = 0
        self.collision_offset = 100000  # large offset to avoid collision with existing IDs
        self.existing_ids = set()
        self.id_collision_counts = {}

    def generate_new_id(self):
        self.no_id_instances += 1
        new_id = str(self.no_id_instances)
        while new_id in self.existing_ids:
            self.no_id_instances += 1
            new_id = str(self.no_id_instances)
        self.existing_ids.add(new_id)
        return f"{new_id}"

    def generate_unique_id(self, model_id):
        if model_id not in self.id_collision_counts:
            self.id_collision_counts[model_id] = 0
        self.id_collision_counts[model_id] += 1
        new_id = int(model_id) + self.id_collision_counts[model_id] * self.collision_offset
        self.existing_ids.add(new_id)
        return new_id
