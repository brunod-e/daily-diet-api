import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUserSchema.parse(req.body)

    const userByEmail = await knex("users").where("email", email).first()

    if (userByEmail) {
      return reply.status(403).send({
        error: "User already exists",
      })
    }

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
