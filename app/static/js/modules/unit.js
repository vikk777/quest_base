import {EventHandler} from './event_handler.js'


export class Unit {
    constructor(selector) {
        this._selector = $(selector);
        this._form = this._selector.find('form');
        this._btnSubmit = this._selector.find('button[type=submit]');

        this._selector.on('submit', new EventHandler('submit', {
            'unit': this._onSubmit.bind(this),
        }));

        this._selector.find('input')[0].focus();
    }

    _onSubmit(form, json) {
        setTimeout(() => window.location.assign(json.response.url), 1000);
    }
}