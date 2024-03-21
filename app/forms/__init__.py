from flask_wtf import FlaskForm
from wtforms import StringField
from .custom import DataRequired_ru


class UnitForm(FlaskForm):
    class Meta:
        csrf = False

    pwd = StringField('Ответ', validators=[DataRequired_ru()])
