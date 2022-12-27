import { Type } from 'class-transformer';
import { SerializedUser } from 'src/routes/users/types';

export class SerializedPost {
  id: number;

  title: string;

  content: string;

  authorId: number;

  @Type(() => SerializedUser)
  author: SerializedUser;

  constructor(partial: Partial<SerializedPost>) {
    Object.assign(this, partial);
  }
}
