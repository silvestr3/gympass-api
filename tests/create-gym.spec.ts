import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "../src/use-cases/create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create gym use case tests", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("Should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "Test Gym",
      phone: "",
      description: null,
      latitude: -16.2522523,
      longitude: -47.9147274,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
