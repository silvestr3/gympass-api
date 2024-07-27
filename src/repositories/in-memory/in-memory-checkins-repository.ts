import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../chekins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckinsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date() : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
