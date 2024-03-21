from flask import Flask
from config import Config, ConfigDebug
import os


application = Flask(__name__)
application.config.from_object(ConfigDebug if application.debug else Config)

from app import routes, model, handlers

if __name__ == "__main__":
    application.run(host='0.0.0.0')
