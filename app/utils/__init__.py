from flask import flash
from flask import request
from flask import render_template
from app.routes import quest
from app.utils.response import Response


# Add form errors messages to flash
def getFormErrors(form):
    errors = {}

    if form.errors:
        for field in form:
            for error in field.errors:
                csrf_msg = 'Неверный токен. Перезагрузите страницу.'
                errors[field.name] = csrf_msg if field.type == 'CSRFTokenField' else error

    return errors or None


def unpackArgs(args):
    # Cutoff submit and csrf_token
    try:
        args.pop('csrf_token')
    except KeyError:
        pass

    return args


def requestHandler(formClass, pFunc, *funcArgs, formName=None, formArgs={}, message=None, cleanForm=True, **kwargs):
    form = formClass(formName, **formArgs) if formName else formClass(**formArgs)

    response = Response()

    if form.validate_on_submit():
        try:
            response.result = pFunc(*funcArgs, **unpackArgs(form.data), **kwargs)
        except Exception as e:
            flash(e.message, 'danger')
            response.ok = False
        else:
            if message:
                flash(message, 'success')
    else:
        response.errors = getFormErrors(form)
        response.ok = False

    if cleanForm:
        request.form = {}

    return response


def responseHandler(template, forms={}, **kwargs):
    return render_template(template, forms=forms, **kwargs)
