export class CreatePostCommand {
  public readonly title: string;
  public readonly content: string;
  public readonly authorId: string;

  constructor(title: string, content: string, authorId: string) {
    this.title = title;
    this.content = content;
    this.authorId = authorId;
  }
}
