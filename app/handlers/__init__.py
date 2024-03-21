from app import application
from flask import redirect
from flask import url_for
import app.utils as utils


@application.errorhandler(404)
def not_found_error(error):
    return utils.responseHandler('404.html'), 404


@application.errorhandler(500)
def internal_error(error):
    return utils.responseHandler('500.html'), 500


@application.errorhandler(405)
def not_allowed_error(error):
    return redirect(url_for('index'))
