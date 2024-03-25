from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms import RadioField
from wtforms import BooleanField
from .custom import DataRequired_ru


class BaseForm(FlaskForm):
    class Meta:
        csrf = False


class UnitFormStr(BaseForm):
    answer = StringField('Ответ', validators=[DataRequired_ru()])
    type = 'group'


class UnitFormRadio(BaseForm):
    answer = RadioField()
    type = 'inline'


class UnitFormCheck(BaseForm):
    a0 = BooleanField()
    a1 = BooleanField()
    a2 = BooleanField()
    a3 = BooleanField()
    type = 'inline'

    def add(self, fields):
        for field in self:
            field.label = fields[field.name]
