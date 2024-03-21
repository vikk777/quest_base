from flask import render_template
from flask import jsonify


class Response():
    def __init__(self):
        self.ok = True
        self.response = None
        self.result = None
        self.errors = {}

    def json(self):
        return jsonify({'ok': self.ok,
                        'response': self.response or self.result,
                        'errors': self.errors,
                        'alerts': render_template('inc/alerts.html')})
