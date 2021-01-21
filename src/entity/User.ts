import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// interface user {
//   id: number;

//   firstname: string;

//   lastname: string;

//   email: string;

//   username: string;

//   password: string;
// }

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
