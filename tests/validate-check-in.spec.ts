import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { ValidateCheckinUseCase } from "@/use-cases/validate-check-in";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: ValidateCheckinUseCase;

describe("Validate check-in use case tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new ValidateCheckinUseCase(checkInsRepository);

    // vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.useRealTimers();
  });

  it("Should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("Should be not able to validate inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
