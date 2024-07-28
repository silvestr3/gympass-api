import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "@/use-cases/fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use case tests", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("Should be fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Far gym",
      phone: "",
      description: null,
      latitude: -16.7366559,
      longitude: -49.3077524,
    });

    await gymsRepository.create({
      title: "Near gym",
      phone: "",
      description: null,
      latitude: -16.2522523,
      longitude: -47.9147274,
    });

    const { gyms } = await sut.execute({
      userLatitude: -16.2522523,
      userLongitude: -47.9147274,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near gym" })]);
  });
});
