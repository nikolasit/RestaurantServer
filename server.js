require("make-promises-safe")

const fastify = require("fastify")({ logger: true })
const path = require('path')

const categories = require("./db/categories")
const menu = require("./db/menu")
const preparationTimes = require("./db/preparation_times")

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'images'),
    prefix: '/images/',
})

fastify.get("/categories", async (request, reply) => {
    return { categories: categories }
})

fastify.get("/menu", async (request, reply) => {
    const category = request.query.category

    if (category) {
        return { items: menu.filter(menuItem => menuItem.category === category) }
    } else {
        return { items: [] }
    }
})

fastify.post("/order", async (request, reply) => {
    const menuIds = request.body && request.body.menuIds ? request.body.menuIds : []

    if (Array.isArray(menuIds) && menuIds.length > 0) {
        return { preparation_time: menuIds.reduce((acc, val) => acc + (preparationTimes[val] || 0), 0) }
    } else {
        return { preparation_time: 0 }
    }
})

const PORT = 3000

const start = async () => {
    try {
        fastify.listen(PORT)
        fastify.log.info(`server listening on ${PORT}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()