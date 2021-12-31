import "dotenv/config";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import * as argon from "argon2";
import { createAccessToken, refreshToken } from "../middleware/auth";
import "./../context/resContext";
import { resContext } from "./../context/resContext";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { validateEmail } from "../utils/validateemail";

@ObjectType()
class ErrorField {
  @Field()
  field: string;
  @Field()
  message: string;
}

@InputType()
class LoginInput {
  @Field()
  emailOrUsername: string;
  @Field()
  password: string;
}

@ObjectType()
class LoginResponse {
  @Field(() => [ErrorField], { nullable: true })
  errors?: ErrorField[];

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
  // refreshToken: refreshToken(user),

  // @Field()
  // Tokens:[accessToken: string, refreshToken: string]
}

@Resolver()
export class userResolver {
  @Query(() => String)
  hello() {
    return `hi`;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: resContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne({ where: { id: req.session.userId } });
    return user;
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

  /* revoke users access token */
  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => String) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  /* register mutation */
  @Mutation(() => LoginResponse || Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string,
    @Ctx() { req }: resContext
  ): Promise<LoginResponse | Boolean> {
    let user = await User.findOne({
      where: { email: email },
    });
    const hashedPassword = await argon.hash(password);

    try {
      // const user = await User.findOne({ where: { email } });

      // check empty username field
      if (username.length < 3) {
        return {
          errors: [
            {
              field: "username",
              message: "Username length must be greater than 3",
            },
          ],
        };
      }

      // check empty password field
      if (password.length < 3) {
        return {
          errors: [
            {
              field: "password",
              message: "password length must be greater than 3",
            },
          ],
        };
      }

      // validate email field
      const validEmail = validateEmail(email);
      if (!validEmail) {
        return {
          errors: [
            {
              field: "email",
              message: "invalid email format",
            },
          ],
        };
      }

      // check if user exist
      if (user) {
        return {
          errors: [
            {
              field: "user email",
              message: "User with email already exist",
            },
          ],
        };
      }

      // save user to db
      if (!user) {
        await User.insert({
          username,
          email,
          password: hashedPassword,
        });
      }
    } catch (err) {
      console.log(err);
      return {
        errors: [
          {
            field: "user",
            message: "couldn't create user",
          },
        ],
      };
    }

    user = (await User.findOne({
      where: { email: email },
    })) as User;

    // Set session cookie for registered user and auto log in
    req.session.userId = user.id;

    return {
      accessToken: createAccessToken(user),
      // refreshToken: refreshToken(user),
    };
  }

  /* login mutation */
  @Mutation(() => LoginResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { req }: resContext
  ): Promise<LoginResponse> {
    let user = await User.findOne({
      where: { email: options.emailOrUsername },
    });

    if (!user) {
      user = await User.findOne({
        where: { username: options.emailOrUsername },
      });

      if (!user) {
        return {
          errors: [
            {
              field: "username or email",
              message: "Username or email doesn't exist",
            },
          ],
        };
      }
    }
    const isPassValid = await argon.verify(user.password, options.password);

    if (!isPassValid) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      };
    }
    req.session.userId = user.id;

    return {
      accessToken: createAccessToken(user),
      refreshToken: refreshToken(user),
    };
  }
}
