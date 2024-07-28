import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { CheckinUseCase } from "../src/use-cases/check-in";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "../src/use-cases/errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "../src/use-cases/errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe("Check-in use case tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: 0,
      longitude: 0,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-16.1966239),
      longitude: new Decimal(-47.9255421),
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -16.2522523,
        userLongitude: -47.9147274,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
