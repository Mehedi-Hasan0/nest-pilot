export class AddCommentCommand {
  public readonly content: string;
  public readonly authorId: string;
  public readonly postId: string;

  constructor(content: string, authorId: string, postId: string) {
    this.content = content;
    this.authorId = authorId;
    this.postId = postId;
  }
}
