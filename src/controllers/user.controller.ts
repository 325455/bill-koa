import { Context } from "koa";
import userService from "../services/user.service";
import { PASSWORD_ERROR, UNKNOWN_ERROR } from "@/config/constants";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { IRequestBody } from "@/type";
import md5Password from "@/utils/md5_password";

class userContraller {
  // 创建用户
  async create(ctx: Context) {
    try {
      await userService.save(ctx);
      return (ctx.body = {
        code: "0",
        message: "注册成功",
      });
    } catch (err) {
      ctx.err = err;
      ctx.app.emit("error", UNKNOWN_ERROR, ctx);
    }
  }
  //登录
  async signIn(ctx: Context) {
    const { phone } = ctx.request.body as IRequestBody;
    const privateKey = fs.readFileSync(
      path.resolve(__dirname, "../config/keys/private.key")
    );
    const payload = { phone };

    const token = jwt.sign(payload, privateKey, {
      expiresIn: 60 * 60 * 60 * 60,
      algorithm: "RS256",
    });

    ctx.body = {
      code: "0",
      token,
      message: "登录成功~",
    };
  }
  //获取用户信息
  async getUserInfo(ctx: Context) {
    ctx.body = {
      code: "0",
      user: ctx.user,
    };
  }
  //修改用户信息
  async changeUserInfo(ctx: Context) {
    const res = await userService.changeUserInfo(ctx);
    if (res) {
      ctx.body = {
        code: "0",
        message: "信息修改成功",
      };
    }
  }
  //修改密码
  async changePassword(ctx: Context) {
    const { oldPassword, newPassword } = ctx.request.body as any;
    const { phone } = ctx.user;
    //判断密码是否正确
    const truePassword = await userService.findPassword(phone);
    if (!(md5Password(oldPassword) === truePassword)) {
      return ctx.app.emit("error", PASSWORD_ERROR, ctx);
    }
    const res = await userService.changePassword(
      phone,
      md5Password(newPassword)
    );
    if (res) {
      ctx.body = {
        code: "0",
        message: "修改密码成功",
      };
    }
  }
}

export default new userContraller();
