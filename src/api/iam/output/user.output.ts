import { User } from '@/api/entities';

export class UserOutput {
  private uuid: string;
  private email: string;
  private username: string;
  private firstname: string;
  private lastname: string;
  private bio: string;
  private avatar: string;
  private birthday: Date;
  constructor(user: User) {
    this.uuid = user.uuid;
    this.email = user.email;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.bio = user.bio;
    this.avatar = user.avatar;
    this.birthday = user.birthday;
  }
}
