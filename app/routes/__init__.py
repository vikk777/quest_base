from flask import redirect, url_for
from app.model.quest import Quest
from app import application
from functools import wraps


quest = Quest()


def admin_required(route):
    @wraps(route)
    def checkAdmin(*args, **kwargs):
        if quest.isAdmin():
            return route(*args, **kwargs)
        return redirect(url_for('login'))
    return checkAdmin


@application.route('/favicon.ico/')
def favicon():
    return redirect(url_for('static', filename='image/favicon.ico'))


from . import index
