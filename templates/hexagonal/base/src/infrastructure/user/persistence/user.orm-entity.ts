import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  public email!: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  public passwordHash!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;
}
