import { Field, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity({ name: "user" })
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

  @Field()
  @Column("text")
  email: string;

  @Field()
  @Column()
  username: string;

  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
