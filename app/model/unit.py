from app.exceptions import WrongPwdError
from app.forms import UnitForm


class UnitModel():
    def __init__(self, id, pwd, form=UnitForm, hint=None):
        self.id = id
        self.pwd = pwd
        self.solved = False
        self.form = form
        self.hint = hint

    def getForm(self):
        return self.form

    def check(self, pwd=None):
        if self.pwd != pwd:
            raise WrongPwdError

        return True
