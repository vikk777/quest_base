from app import application
from app.routes import quest
import app.utils as utils


@application.route('/')
def index():
    return utils.responseHandler('index.html')


@application.route('/unit/<id>/', methods=['GET'])
def getUnit(id):
    id = int(id)
    unit = quest.getUnit(id)
    return utils.responseHandler(f'unit{unit.id}.html', unit=unit, form=unit.getForm()(), progress=quest.progress())


@application.route('/unit/<id>/', methods=['POST'])
def checkUnit(id):
    id = int(id)
    response = utils.requestHandler(quest.unitForm(id), quest.checkUnit, id=id, message='Верно')
    response.response = {'url': response.result}
    return response.json()


@application.route('/end/')
def congrads():
    return utils.responseHandler('congrads.html')
