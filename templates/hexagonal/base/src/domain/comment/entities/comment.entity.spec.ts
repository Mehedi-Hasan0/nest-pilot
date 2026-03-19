import { Comment } from './comment.entity';
import { UserId } from '../../user/value-objects/user-id.vo';
import { PostId } from '../../post/value-objects/post-id.vo';

describe('Comment Entity', () => {
  const validProps = {
    content: 'This is a valid comment content.',
    authorId: UserId.generate(),
    postId: PostId.generate(),
  };

  it('should create a valid comment', () => {
    const comment = Comment.create(validProps);
    expect(comment.content).toBe(validProps.content);
  });

  it('should throw error for empty content', () => {
    expect(() => {
      Comment.create({ ...validProps, content: '' });
    }).toThrow('Content must be between 1 and 500 characters.');
  });

  it('should throw error for content too long', () => {
    const longContent = 'a'.repeat(501);
    expect(() => {
      Comment.create({ ...validProps, content: longContent });
    }).toThrow('Content must be between 1 and 500 characters.');
  });

  it('should allow updating content', () => {
    const comment = Comment.create(validProps);
    const newContent = 'Updated comment content';
    comment.updateContent(newContent);
    expect(comment.content).toBe(newContent);
  });
});
