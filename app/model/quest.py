from flask import url_for
from .unit import UnitFabric
from app.exceptions import WrongPwdError


class Quest():
    def __init__(self):
        self.current = 0
        self.wrongs = 0
        fabric = UnitFabric()
        self.units = []
        self.units.append(UnitModel(len(self.units), 'pwd'))
        self.units.append(UnitModel(len(self.units), 'pwd2'))

    def getUnit(self, id):
        self.current = id
        return self.units[min(self.current, id)]

    def checkUnit(self, *args, id=None, **kwargs):
        try:
            if self.units[id].check(*args, **kwargs):
                self.current += 1
                return url_for('checkUnit', id=self.current) if self.current != len(self.units)\
                    else url_for('congrads')
        except WrongPwdError as e:
            self.wrongs += 1
            raise e

    def unitForm(self, id):
        return self.units[id].getForm()

    def progress(self):
        return self.current / len(self.units) * 100

    def next(self):
        self.current += 1
        return self.getUnit(self.current)

    def getWrongs(self):
        return self.wrongs
