from wtforms.validators import DataRequired


class DataRequired_ru(DataRequired):
    def __init__(self):
        self.message = 'Заполните это поле'
        self.field_flags = {"required": True}
