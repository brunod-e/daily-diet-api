import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest"
import { execSync } from "node:child_process"
import { app } from "../src/app"
import request from "supertest"

describe("Meals routes", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync("npm run knex migrate:rollback --all")
    execSync("npm run knex migrate:latest")
  })

  it("should be able to create a new meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal name",
        description: "Test meal description",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)
  })

  it("should be able to list all meals from a user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal A",
        description: "Test meal description 1",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal B",
        description: "Test meal description 2",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)
    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal C",
        description: "Test meal description 3",
        isOnDiet: false,
        date: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days after
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    expect(listMealsResponse.body.meals).toHaveLength(3)
    expect(listMealsResponse.body.meals[0].name).toEqual("Test meal C")
    expect(listMealsResponse.body.meals[1].name).toEqual("Test meal B")
    expect(listMealsResponse.body.meals[2].name).toEqual("Test meal A")
  })

  it("should be able to get a specific meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal A",
        description: "Test meal description 1",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    expect(getMealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: "Test meal A",
        description: "Test meal description 1",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    })
  })

  it("should be able to update a meal from a user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal A",
        description: "Test meal description 1",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal B",
        description: "Test meal description 2",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(204)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    expect(getMealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: "Test meal B",
        description: "Test meal description 2",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    })
  })

  it("should be able to delete a meal from a user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal A",
        description: "Test meal description 1",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(204)

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(404)
  })

  it("should be able to get metrics from a user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal A",
        description: "Test meal description 1",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal B",
        description: "Test meal description 2",
        isOnDiet: true,
        date: "Thu Dec 14 2023 22:57:59 GMT-0300",
      })
      .expect(201)
    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .send({
        name: "Test meal C",
        description: "Test meal description 3",
        isOnDiet: false,
        date: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days after
      })
      .expect(201)

    const metricsResponse = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", userResponse.get("Set-Cookie"))
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMeals: 3,
      totalMealsOnDiet: 2,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 2,
    })
  })
})
