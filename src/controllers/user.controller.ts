import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
const bcrypt = require("bcrypt");

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await getRepository(User)
    .find()
    .catch((err) => {
      console.log(err);
    });
  return res.json(users);
};
// interface user {
//   id: number;

//   firstname: string;

//   lastname: string;

//   email: string;

//   username: string;

//   password: string;
// }
// type userpp = user[];

export const createUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  //   init bycrypt
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  const hash = bcrypt.hashSync(req.body.password, salt);

  const createUser = getRepository(User).create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    password: hash,
  });
  const results = await getRepository(User)
    .save(createUser)
    .catch((err) => {
      console.log(err);
    });
  const users = await getRepository(User)
    .findOne({ email: req.body.email })
    .catch((err) => {
      console.log(err);
    });
  return res.json(users);
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !password)
    return res.status(400).json({ msg: "Not All Fields Have Been Entered" });

  const users = await getRepository(User)
    .findOne({ email: email })
    .catch((err) => {
      console.log(err);
    });
    if(!users){
      return res.status(400).json({msg: "user does not exist"})
    }

  if (users) {
    const isMatch = await bcrypt.compare(password, users.password);

    /* console.log(password);
    console.log(users.password);
    console.log(isMatch); */

    if(!isMatch){
      return res.status(400).json({msg: "user credentials is incorrect"})
    }
    
    
    return res.json({email: users.email, username: users.username});
  }

  return res.json(users);
};
