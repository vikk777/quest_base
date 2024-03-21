import {showAlerts} from './alerts.js'

export function EventHandler(type, handlers, onError) {
    switch (type) {
    case 'submit':
        return function(event) {
            let form = event.target;
            let handler = handlers[form.getAttribute('id')];
            handler !== undefined && (event.preventDefault() || new RequestHandler(form, handler, onError));
        }

    case 'click':
    case 'change':
    case 'input':
        return function(event) {
            let handler = handlers[event.target.id];
            handler && (handler => {
                handler instanceof Array
                ? handler.forEach(h => {
                    h(event);
                })
                : handler(event);
            })(handler);
        }
    }
}

export function RequestHandler(form, callback, onError) {
    this.renderFormErrors = function(form, json) {
        /* Clean errors */
        $('#field-error', form).remove();
        let errors = new Map(Object.entries(json.errors));

        if (errors.size) {
            /* Set new errors */
            errors.forEach((error, field) => {
                let formField = $(form).find(`[name=${field}]`);
                let errorElem = (elem => {
                    return $('body').append(elem), elem
                })($().create('span')).addClass(['badge', 'bg-danger', 'mb-1']).text(error);
                errorElem[0].id = 'field-error';

                (fieldContainer => {
                    return fieldContainer.containsClass('input-group')
                           ? fieldContainer
                           : formField
                })(formField.parent()).before(errorElem)
            })
        }
    };

    this.renderAlerts = function(json) {
        let tmp = $().create('div').html(json.alerts);

        let newAlerts = tmp.find('#alerts');
        if (newAlerts.isEmpty()) {
            return;
        }

        let alerts = $('#alerts');
        if (!alerts.isEmpty()) {
            newAlerts.children().each(alert => {
                                    alerts.append(alert);
                                })
        }
        else {
            $('body').append(newAlerts);
            alerts = newAlerts;
        }

        showAlerts(alerts);
    };

    form.method == 'post' && fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(json => {
        if (!json) {
            return;
        }

        this.renderAlerts(json);
        this.renderFormErrors(form, json);

        if (!json.ok) {
            onError && onError();
            return;
        }

        callback && callback(form, json);
    })
}
