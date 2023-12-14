import { FastifyReply, FastifyRequest } from "fastify"

export async function checkUserExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user?.id

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
    })
  }
}
