import fastify from "fastify"
import { z } from "zod"
import { sql } from "./lib/postgres"
import { redis } from "./lib/redis"
import postgres from "postgres"

const app = fastify()

app.post("/api/links", async (request, reply) => {
   
    const requestShema = z.object({
        code: z.string().min(3),
        url: z.string().url()
    })

    const { code, url } = requestShema.parse(request.body)

    try {
        const result = await sql/*sql*/  `
          INSERT INTO short_links (code, original_url)
          VALUES (${code}, ${url})
          RETURNING id
        `
        const link = result[0]
        return reply.status(201).send({ shortLinkId: link.id })        
    } catch (err) {
        if (err instanceof postgres.PostgresError) {
            if (err.code === "23505") {
              return reply.status(400).send({ message: "Duplicated code!" })
            }
        }

        console.error(err)
        return reply.status(500).send({ message: "Internal error." })
    }

})

app.get("/api/links", async () => {
    const result = await sql/*sql*/  `
      SELECT *
      FROM short_links
      ORDER BY created_at DESC
    `
    return result
})

app.get("/:code", async (request, reply) => {
    const getLinkSchema = z.object({
      code: z.string().min(3),
    })
  
    const { code } = getLinkSchema.parse(request.params)
  
    const result = await sql/*sql*/ `
      SELECT id, original_url
      FROM short_links
      WHERE short_links.code = ${code}
    `
    if (result.length === 0) {
        return reply.status(400).send({ message: "Link not found." })
    }

    const link = result[0]
    await redis.zIncrBy("metrics", 1, String(link.id))
    return reply.redirect(301, link.original_url) 
  })

app.listen({
    port:3333
}).then(() =>{
    console.log("http server running")
})