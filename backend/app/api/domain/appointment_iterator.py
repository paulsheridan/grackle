from collections.abc import Iterable, Iterator
from typing import Any, List

from app.api import schemas
from app.api import models


class AppointmentsCollection(Iterable):
    def __init__(self, collection: List[Any] | None = None) -> None:
        self._collection = collection if collection else []

    def __getitem__(self, index: int) -> Any:
        return self._collection[index]

    def __iter__(self) -> TimeSeriesIterator:
        return TimeSeriesIterator(self)

    def add_item(self, item: Any) -> None:
        self._collection.append(item)


class TimeSeriesIterator(Iterator):
    _index: int = 0
    _reverse: bool = False

    def __init__(
        self, collection: AppointmentsCollection, reverse: bool = False
    ) -> None:
        self._collection = collection
        self._index = 0

    def __next__(self) -> Any:
        try:
            value = self._collection[self._index]
            self._index += 1
        except IndexError:
            raise StopIteration()
        return value
