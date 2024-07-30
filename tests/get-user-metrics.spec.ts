import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { GetUserMetricsUseCase } from "../src/use-cases/get-user-metrics";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user metrics use case tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("Should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toBe(2);
  });
});
