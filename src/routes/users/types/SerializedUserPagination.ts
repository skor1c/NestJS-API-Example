import { Type } from 'class-transformer';
import { SerializedUser } from './SerializedUser';

export class SerializedUserPagination {
  @Type(() => SerializedUser)
  users: SerializedUser[];

  numberOfPages: number;

  currentPage: number;

  constructor(partial: Partial<SerializedUserPagination>) {
    Object.assign(this, partial);
  }
}
