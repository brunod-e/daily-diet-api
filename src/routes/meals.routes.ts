import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function mealsRoutes(app: FastifyInstance) {
  // Create
  app.post("/", { preHandler: [checkSessionIdExists] }, async (req, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const { name, description, isOnDiet, date } = createMealSchema.parse(
      req.body
    )

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
      user_id: req.user?.id,
    })

    return reply.status(201).send()
  })

  // List All
  app.get("/", { preHandler: [checkSessionIdExists] }, async (req, reply) => {
    const meals = await knex("meals")
      .where("user_id", req.user?.id)
      .orderBy("date", "desc")

    return reply.status(200).send({ meals })
  })

  // List By Id
  app.get(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const getMealByIdSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = getMealByIdSchema.parse(req.params)
      const meal = await knex("meals")
        .where("user_id", req.user?.id)
        .where("id", mealId)
        .first()

      if (!meal) return reply.status(404).send({ error: "Meal not found" })

      return reply.status(200).send({ meal })
    }
  )
}
