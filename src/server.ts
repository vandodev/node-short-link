import fastify from "fastify"
import { z } from "zod"

const app = fastify()

app.post("/links", async (request) => {
    // const {code, url} = z.object({
    //     code: z.string().min(3),
    //     url: z.string().url()
    // }).parse(request.body)

    const requestShema = z.object({
        code: z.string().min(3),
        url: z.string().url()
      })
      const { code, url } = requestShema.parse(request.body)
})

app.listen({
    port:3333
}).then(() =>{
    console.log("http server running")
})