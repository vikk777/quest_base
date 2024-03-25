import {EventHandler} from './event_handler.js'


export class Unit {
    constructor(selector, timeout=1000) {
        this._selector = $(selector);
        this._form = this._selector.find('form');
        this._btnSubmit = this._selector.find('button[type=submit]');
        this._timeout = timeout;
        this._afterSuccess = null;

        this._selector.on('submit', new EventHandler('submit', {
            'unit': this._onSubmit.bind(this),
        }));

        this._selector.find('input')[0].focus();
    }

    _onSubmit(form, json) {
        this._afterSuccess && this._afterSuccess();
        setTimeout(() => window.location.assign(json.response.url), this._timeout);
    }

    set timeout(to) {
        this._timeout = to;
    }

    set afterSuccess(foo) {
        this._afterSuccess = foo;
    }
}