export function showAlerts(alerts) {
    if (alerts.isEmpty()) {
        return;
    }

    alerts.on('closed.bs.alert', event => {
        if (alerts.children().isEmpty()) {
            alerts.remove();
        }
    });

    alerts.children('.alert').each(alertElem => {
        let alert = bootstrap.Alert.getOrCreateInstance(alertElem);

        setTimeout(() => alert._element && alert.close(), 5000)
    })
}

showAlerts($('#alerts'));
