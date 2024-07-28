import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "../src/use-cases/search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms use case tests", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("Should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Javascript gym",
      phone: "",
      description: null,
      latitude: -16.2522523,
      longitude: -47.9147274,
    });

    await gymsRepository.create({
      title: "Typescript gym",
      phone: "",
      description: null,
      latitude: -16.2522523,
      longitude: -47.9147274,
    });

    const { gyms } = await sut.execute({
      query: "Javascript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript gym" }),
    ]);
  });

  it("Should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript gym ${i}`,
        phone: "",
        description: null,
        latitude: -16.2522523,
        longitude: -47.9147274,
      });
    }

    const { gyms } = await sut.execute({
      query: "Javascript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: `Javascript gym 21` }),
      expect.objectContaining({ title: `Javascript gym 22` }),
    ]);
  });
});
