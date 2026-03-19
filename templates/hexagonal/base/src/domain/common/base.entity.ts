export abstract class BaseEntity<ID> {
  protected readonly _id: ID;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(id: ID, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    const now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
  }

  get id(): ID {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected markUpdated(): void {
    this._updatedAt = new Date();
  }

  public equals(object?: BaseEntity<ID>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof BaseEntity)) {
      return false;
    }

    return this._id === object._id;
  }
}
