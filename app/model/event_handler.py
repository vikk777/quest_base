class _EventHandler():
    """This class realize events processing and callbacks invoking"""

    def __init__(self):
        self._eventMap = {}

    def on(self, event, callback):
        self._eventMap[event] = callback

    def invokeOn(self, event, *args, **kwargs):
        callback = self._eventMap.get(event)
        callback and callback(*args, **kwargs)
