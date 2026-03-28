class StocksRepository:
    def __init__(self):
        self.storage = {}  # user_id -> list of positions

    async def save(self, user_id: str, positions: list):
        self.storage[user_id] = positions

    async def get_by_user(self, user_id: str):
        return self.storage.get(user_id, [])

stocks_repo = StocksRepository()
