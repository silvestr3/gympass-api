import { expect, describe, it, beforeEach } from "vitest";
import { CheckinUseCase } from "./check-in";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: CheckinUseCase;

describe("Check-in use case tests", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new CheckinUseCase(checkInsRepository);
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
