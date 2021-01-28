import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

dotenv.config();

// get all users
export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await getRepository(User)
    .find()
    .catch(err => {
      console.log(err);
    });
  return res.json(users);
};

// create a user
export const createUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const users = await getRepository(User)
    .findOne({ email: req.body.email })
    .catch(err => {
      console.log(err);
    });
  let newUser;

  if (!users) {
    const createUser = getRepository(User).create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      password: hash
    });

    const results = await getRepository(User)
      .save(createUser)
      .catch(err => {
        console.log(err);
      });

    console.log(results);

    newUser = await getRepository(User)
      .findOne({ email: req.body.email })
      .catch(err => {
        console.log(err);
      });
  }

  if (users) {
    return res.status(400).json({ msg: "user already exist" });
  }

  let username;
  username = req.body.username;
  if (!username) {
    username = req.body.email;
  }

  return res.json([
    {
      msg: `user ${username} created successfully`
    }
  ]);
};

// login
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
    .catch(err => {
      console.log(err);
    });
  if (!users) {
    return res.status(400).json({ msg: "user does not exist" });
  }

  if (users) {
    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "user credentials is incorrect" });
    }

    const token = jwt.sign(
      { id: users.id },
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
    );

    return res.json({
      token: token,
      email: users.email,
      username: users.username
    });
  }

  return res.json(users);
};

// delete users
export const deleteUser = async (req: express.Request, res: Response) => {
  try {
    const user = await getRepository(User)
      .findOne({ id: req.user.id })
      .catch(err => {
        console.log(err);
      });

    const deletedUser = await getRepository(User)
      .delete({ id: req.user.id })
      .catch(err => {
        console.log(err);
      });

    if (user) return res.send({ msg: `user ${user.username} deleted` });

    if (!user) return res.status(400).json({ msg: "user not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
