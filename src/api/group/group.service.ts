import { Group, Movie, Theater, User, UserGroup } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(UserGroup) private userGroupRepo: Repository<UserGroup>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Movie) private movieRepo: Repository<Movie>,
    @InjectRepository(Theater) private theaterRepo: Repository<Theater>,
  ) {}

  /**
   * Create a new group associated with a user, provider, and movie.
   * @param userUuid The uuid of the user who created the group.
   * @param theaterId The provider id of the theater the group is associated with.
   * @param movieId The id of the movie the group is associated with.
   * @returns The newly created group.
   */
  async createGroup(
    userUuid: string,
    theaterId: string,
    movieId: string,
    showtimeDate: string,
  ): Promise<Group> {
    const user = await this.userRepo.findOneBy({ uuid: userUuid });
    const theater = await this.theaterRepo.findOneBy({
      provider_id: theaterId,
    });
    const movie = await this.movieRepo.findOneBy({ provider_id: movieId });

    if (!user || !theater || !movie) {
      throw new Error('User, theater, or movie not found');
    }

    const group = this.groupRepo.create({
      name: movie.name,
      movie: movie,
      user: user,
      theater: theater,
      session_date: new Date(showtimeDate),
    });
    await this.groupRepo.save(group);
    return group;
  }

  /**
   * Deletes a group and all of its associated userGroups.
   * @param id The id of the group to delete.
   */
  async deleteGroup(id: number): Promise<void> {
    const group = await this.groupRepo.findOneBy({ id });
    const userGroups = await this.userGroupRepo.findBy({ group });
    for (const userGroup of userGroups) {
      await this.userGroupRepo.remove(userGroup);
    }
    await this.groupRepo.remove(group);
  }
  /**
   * Updates an existing group with new data.
   *
   * @param id The id of the group to update.
   * @param groupData An object containing the fields to update in the group.
   * @returns The updated group.
   */
  async updateGroup(id: number, groupData: Partial<Group>): Promise<Group> {
    const group = await this.groupRepo.findOneBy({ id });

    return this.groupRepo.save({ ...group, ...groupData });
  }
  /**
   * Retrieves all groups that the user has joined with the given.
   * @param uuid The uuid of the user.
   * @returns An array of groups that the user is a part of.
   */
  async getGroupsByUser(uuid: string): Promise<Group[]> {
    const userGroups = await this.userGroupRepo.findBy({
      user: { uuid: uuid },
    });

    return await this.groupRepo.findBy({
      id: In(userGroups.map((ug) => ug.group.id)),
    });
  }
  /**
   * Retrieves all groups that the user with the given uuid owns.
   * @param uuid The uuid of the user.
   * @returns An array of groups that the user owns.
   */
  async getGroupsByOwner(uuid: string): Promise<Group[]> {
    return await this.groupRepo.findBy({ user: { uuid: uuid } });
  }
  /**
   * Retrieves all groups associated with a particular theater.
   * @param provider_id The provider_id of the theater.
   * @returns An array of groups associated with the theater.
   */
  async getByTheater(provider_id: string): Promise<Group[]> {
    return await this.groupRepo.findBy({ theater: { provider_id } });
  }
  /**
   * Retrieves a group by its unique identifier.
   *
   * @param id The unique identifier of the group.
   * @returns A promise that resolves to the group with the given id, or null if no group is found.
   */
  async getById(id: number): Promise<Group> {
    return await this.groupRepo.findOneBy({ id });
  }
}
