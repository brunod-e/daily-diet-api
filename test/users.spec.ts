import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest"
import { execSync } from "node:child_process"
import { app } from "../src/app"
import request from "supertest"

describe("Users routes", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync("npm run dev-knex migrate:rollback --all")
    execSync("npm run dev-knex migrate:latest")
  })

  it("should be able to create a new user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Test User",
        email: "teste@user.com",
      })
      .expect(201)

    const cookies = userResponse.get("Set-Cookie")

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining("sessionId")])
    )
  })
})
