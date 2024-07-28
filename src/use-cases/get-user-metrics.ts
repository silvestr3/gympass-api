import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/chekins-repository";

interface GetUserMetricsUseCaseParams {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkIns: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseParams): Promise<GetUserMetricsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.countByUserId(userId);

    return { checkIns };
  }
}
