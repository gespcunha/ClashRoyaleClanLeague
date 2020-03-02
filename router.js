let handlers = []

module.exports = {
    register: register,
    handlers: handlers
}

function register(id, criteria, handler) {
    handlers.push({
        id: id,
        criteria: criteria,
        handler: handler
    })
}
