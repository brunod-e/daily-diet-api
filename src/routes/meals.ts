import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const summary = await knex("meals")
        .where("session_id", sessionId)
        // .sum("amount", {
        //   as: "totalAmount",
        // })
        .first()

      return { summary }
    }
  )

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const meals = await knex("meals")
        .where("session_id", sessionId)
        .select("*")

      return { meals }
    }
  )

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const getMealSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getMealSchema.parse(req.params)

      const meal = await knex("meals")
        .where({ id, session_id: sessionId })
        .first()

      return { meal }
    }
  )

  app.post("/", async (req, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.number(),
      date: z.date(),
      isDietMeal: z.boolean(),
    })

    const { name, description, date, isDietMeal } = createMealSchema.parse(
      req.body
    )

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    }

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      date,
      is_diet_meal: isDietMeal,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
