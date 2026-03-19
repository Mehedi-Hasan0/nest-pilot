import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('comments')
export class CommentOrmEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  public content!: string;

  @Column({ type: 'uuid', name: 'author_id' })
  public authorId!: string;

  @Column({ type: 'uuid', name: 'post_id' })
  public postId!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;
}
