import {
  Arg,
  Args,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { User } from "../entity/User";
import { compare, hash } from "bcrypt";
import * as dotenv from "dotenv";
import { createAccessToken, refreshToken } from "../middleware/auth";
import "./../context/resContext";
import { resContext } from "./../context/resContext";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

dotenv.config();

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class userResolver {
  @Query(() => String)
  hello() {
    return `hi`;
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: resContext) {
    console.log(payload);

    return `your userId is ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => String) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string,
    @Arg("username") username: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      const user = await User.findOne({ where: { email } });

      if (user) {
        return false;
      }
      if (!user) {
        await User.insert({
          firstname,
          lastname,
          username,
          email,
          password: hashedPassword
        });
      }
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req, res }: resContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("invalid user");
    }
    const isPassValid = await compare(password, user.password);

    if (!isPassValid) {
      throw new Error("invalid user pass");
    }

    res.cookie("rfx", refreshToken(user), {
      httpOnly: true
    });

    return {
      accessToken: createAccessToken(user)
    };
  }
}
