import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import "dotenv/config";
import * as argon from "argon2";
import { createAccessToken, refreshToken } from "../middleware/auth";

// get all users
export const getUsers = async (
  res: Response
): Promise<Response> => {
  const users = await getRepository(User)
    .find()
    .catch((err) => {
      console.log(err);
    });
  let userProperty;
  if (users) {
    userProperty = users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
    }));
  }
  return res.json(userProperty);
};

// create a user
export const createUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const saltRounds = 10;
  const hash = await argon.hash(req.body.password, {saltLength:saltRounds});

  const users = await getRepository(User)
    .findOne({ email: req.body.email })
    .catch((err) => {
      console.log(err);
    });
  // let newUser;

  if (!users) {
    const createUser = await getRepository(User).create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      password: hash,
    })

    const results = await getRepository(User)
      .save(createUser)
      .catch((err) => {
        console.log(err);
      });

    console.log(results);

    await getRepository(User)
      .findOne({ email: req.body.email })
      .catch((err) => {
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
      msg: `user ${username} created successfully`,
    },
  ]);
};

// login
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const email = req.body.email;
  // const username = req.body.username;
  const password = req.body.password;
  try {
    if (!email || !password)
      return res.status(400).json({ msg: "Not All Fields Have Been Entered" });

    const users = await User.findOne({ where: { email } }).catch((err) => {
      console.log(err);
    });
    if (!users) {
      return res.status(400).json({ msg: "user does not exist" });
    }

    if (users) {
      const isMatch = await argon.verify(password, users.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "user credentials is incorrect" });
      }

      /* const token = jwt.sign(
        { id: users.id },
        process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
      ); */

      res.cookie("rfx", refreshToken(users), { httpOnly: true });

      return res.send({
        accessToken: createAccessToken(users),
        refreshToken: refreshToken(users),
      });
    }

    return res.json(users);
  } catch (err) {
    return res.json({ msg: "login error incorrrect credentials", err: err });
  }
};

// delete users
export const deleteUser = async ( res: Response) => {
  try {
    // find user by payload and delete by uuid
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
