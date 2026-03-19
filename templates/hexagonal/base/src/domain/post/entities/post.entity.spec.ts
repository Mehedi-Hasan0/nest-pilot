import { Post, PostStatus } from './post.entity';
import { PostTitle } from '../value-objects/post-title.vo';
import { PostContent } from '../value-objects/post-content.vo';
import { UserId } from '../../user/value-objects/user-id.vo';

describe('Post Entity', () => {
  it('should create a post in DRAFT status', () => {
    const post = Post.createDraft({
      title: PostTitle.create('Test Title'),
      content: PostContent.create('Test Content'),
      authorId: UserId.generate(),
    });
    expect(post.status).toBe(PostStatus.DRAFT);
  });

  it('should publish a draft post', () => {
    const post = Post.createDraft({
      title: PostTitle.create('Test Title'),
      content: PostContent.create('Test Content'),
      authorId: UserId.generate(),
    });
    post.publish();
    expect(post.status).toBe(PostStatus.PUBLISHED);
  });

  it('should throw error when publishing already published post', () => {
    const post = Post.createDraft({
      title: PostTitle.create('Test Title'),
      content: PostContent.create('Test Content'),
      authorId: UserId.generate(),
    });
    post.publish();
    expect(() => post.publish()).toThrow();
  });

  it('should unpublish a published post', () => {
    const post = Post.createDraft({
      title: PostTitle.create('Test Title'),
      content: PostContent.create('Test Content'),
      authorId: UserId.generate(),
    });
    post.publish();
    post.unpublish();
    expect(post.status).toBe(PostStatus.UNPUBLISHED);
  });
});
