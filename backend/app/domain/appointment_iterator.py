from collections.abc import Iterable, Iterator
from typing import Any, List

from app import schemas
from app import models


class AppointmentsCollection(Iterable):
    def __init__(self, appointments: List[Any] | None = None) -> None:
        self._appt_collection = appointments if appointments else []

    def __getitem__(self, index: int) -> Any:
        return self._appt_collection[index]

    def __iter__(self) -> TimeSeriesIterator:
        return TimeSeriesIterator(self)


class TimeSeriesIterator(Iterator):
    _index: int = 0

    def __init__(self, appointments: AppointmentsCollection) -> None:
        self._collection = appointments
        self._index = 0

    def __next__(self) -> Any:
        try:
            value = self._collection[self._index]
            self._index += 1
        except IndexError:
            raise StopIteration()
        return value
