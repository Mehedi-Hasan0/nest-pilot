export class PublishPostCommand {
  constructor(
    public readonly postId: string,
    public readonly requestingUserId: string,
  ) {}
}
