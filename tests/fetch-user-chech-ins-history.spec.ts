import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { FetchUserCheckInsHistoryUseCase } from "../src/use-cases/fetch-user-chech-ins-history";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch user check-in history use case tests", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("Should be able to fetch user check in history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("Should be able to fetch paginated user check in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
