from app.exceptions import WrongPwdError
from app.forms import UnitFormStr
from app.forms import UnitFormRadio
from app.forms import UnitFormCheck


class UnitFabric(object):
    def __init__(self):
        self.amount = -1

    def incAmount(method):
        def wrapper(self, *args, **kwargs):
            self.amount += 1
            return method(self, *args, **kwargs)
        return wrapper

    @incAmount
    def unitStr(self, pwd, hint=None, exact=False):
        return UnitModel(self.amount, pwd=pwd, form=UnitFormStr, hint=hint, exact=exact)

    @incAmount
    def unitRadio(self, pwd, choices, hint=None):
        return UnitModel(self.amount, pwd=pwd, form=UnitFormRadio, choices=choices, hint=hint)

    @incAmount
    def unitCheck(self, pwd, choices, hint=None):
        return UnitModel(self.amount, pwd=pwd, form=UnitFormCheck, choices=choices, hint=hint)

    @incAmount
    def unitEmpty(self):
        return UnitModel(self.amount)


class UnitModel(object):
    def __init__(self, id, pwd=None, form=None, hint=None, exact=False, choices=[]):
        self.id = id
        self.pwd = pwd
        self.exact = exact
        self.form = form
        self.hint = hint
        self.choices = choices

    def getForm(self):
        form = self.setChoices()
        return form

    def setChoices(self):
        if not self.form:
            return None

        form = self.form()

        if self.choices:
            if form.__contains__('answer'):
                form.answer.choices = self.choices
            else:
                form.add(self.choices)

        return form

    def check(self, answer=None, **kwargs):
        if not answer and not kwargs:
            return True

        if not self.exact and answer:
            answer = answer.lower()

        if kwargs:  # checkbox
            for key, val in kwargs.items():
                if (key not in self.pwd and val) or (key in self.pwd and not val):
                    raise WrongPwdError
        elif isinstance(self.pwd, list):  # radio
            if answer not in self.pwd:
                raise WrongPwdError
        elif self.pwd != answer:  # string
            raise WrongPwdError

        return True
