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
      date: new Date(date).toISOString(),
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
      const meal = await knex("meals").where("id", mealId).first()

      if (!meal) return reply.status(404).send({ error: "Meal not found" })

      return reply.status(200).send({ meal })
    }
  )

  // Update
  app.put(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsSchema.parse(req.params)

      const updateMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = updateMealSchema.parse(
        req.body
      )

      const meal = await knex("meals").where("id", mealId).first()

      if (!meal) return reply.status(404).send({ error: "Meal not found" })

      await knex("meals")
        .where({
          user_id: req.user?.id,
          id: mealId,
        })
        .update({
          name,
          description,
          is_on_diet: isOnDiet,
          date: new Date(date).toISOString(),
          updated_at: knex.fn.now(),
        })

      return reply.status(204).send()
    }
  )

  // Delete
  app.delete(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsSchema.parse(req.params)

      const meal = await knex("meals").where("id", mealId).first()

      if (!meal) return reply.status(404).send({ error: "Meal not found" })

      await knex("meals").where("id", mealId).del()

      return reply.status(204).send()
    }
  )

  // Metrics
  app.get(
    "/metrics",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const totalMeals = await knex("meals").where("user_id", req.user?.id)

      const totalMealsOnDiet = await knex("meals")
        .where({
          user_id: req.user?.id,
          is_on_diet: true,
        })
        .count("id", { as: "total" })
        .first()

      const totalMealsOffDiet = await knex("meals")
        .where({
          user_id: req.user?.id,
          is_on_diet: false,
        })
        .count("id", { as: "total" })
        .first()

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentOnDietSequence++

            if (acc.currentOnDietSequence > acc.bestOnDietSequence) {
              acc.bestOnDietSequence = acc.currentOnDietSequence
            }
          } else {
            acc.currentOnDietSequence = 0
          }

          return acc
        },
        {
          bestOnDietSequence: 0,
          currentOnDietSequence: 0,
        }
      )

      return reply.status(200).send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      })
    }
  )
}
