import json
import os
import uuid

_FILE = os.path.join(os.path.dirname(__file__), "goals_data.json")

class _GoalsRepo:
    def __init__(self):
        self._data = []
        if os.path.exists(_FILE):
            try:
                with open(_FILE, "r") as f:
                    self._data = json.load(f)
            except Exception:
                self._data = []

    def _flush(self):
        with open(_FILE, "w") as f:
            json.dump(self._data, f, default=str)

    async def insert_one(self, goal: dict) -> str:
        gid = str(uuid.uuid4())
        goal["_id"] = gid
        self._data.append(goal)
        self._flush()
        return gid

    async def find_by_user(self, user_id: str) -> list:
        return [g for g in self._data if g.get("user_id") == user_id]

    async def delete_one(self, goal_id: str) -> bool:
        before = len(self._data)
        self._data = [g for g in self._data if g.get("_id") != goal_id]
        if len(self._data) < before:
            self._flush()
            return True
        return False

    async def mark_complete(self, goal_id: str) -> bool:
        for g in self._data:
            if g.get("_id") == goal_id:
                g["status"] = "completed"
                self._flush()
                return True
        return False

goals_repo = _GoalsRepo()
