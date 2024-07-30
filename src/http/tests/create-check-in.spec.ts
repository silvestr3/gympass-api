import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create check-in (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create check in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Javascript gym",
        latitude: -16.2522523,
        longitude: -47.9147274,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -16.2522523,
        longitude: -47.9147274,
      });

    expect(response.statusCode).toEqual(201);
  });
});
