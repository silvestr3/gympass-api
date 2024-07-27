import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case tests", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("Should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      id: createdUser.id,
    });

    expect(user.name).toEqual("John Doe");
  });

  it("Should not be able to get user profile with invalid ID", async () => {
    await expect(() => {
      return sut.execute({
        id: "non-existing",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
