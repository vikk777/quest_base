class QuestError(Exception):
    message = 'Неверный юнит'


class WrongPwdError(Exception):
    message = 'Неверный ответ'
