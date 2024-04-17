from typing import Protocol


class Repository(Protocol):
    def list(self):
        pass

    def detail(self):
        pass

    def create(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass
