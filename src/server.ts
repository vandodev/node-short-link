import fastify from "fastify"

const app = fastify()

app.get('/teste', () => {
    return "Hello world"
})

app.listen({
    port:3333
}).then(() =>{
    console.log("http server running")
})