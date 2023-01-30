import { Regulator, User } from '@prisma/client';

export type UserWithRegulator = User & { regulator: Regulator };
