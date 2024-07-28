import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "../src/use-cases/authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "../src/use-cases/errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case tests", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("Should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "john@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with unexisting email", async () => {
    await expect(() => {
      return sut.execute({
        email: "john@example.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() => {
      return sut.execute({
        email: "john@example.com",
        password: "654321",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
