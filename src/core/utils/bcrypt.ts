import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(rawPassword, salt);
}

export function comparePaswords(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}
