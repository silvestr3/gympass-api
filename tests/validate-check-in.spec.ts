import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { ValidateCheckinUseCase } from "@/use-cases/validate-check-in";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { LateCheckInValidationError } from "@/use-cases/errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: ValidateCheckinUseCase;

describe("Validate check-in use case tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new ValidateCheckinUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("Should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    vi.advanceTimersByTime(1000 * 60 * 21); // advancing 21 minutes

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
