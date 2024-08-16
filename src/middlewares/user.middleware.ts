import { Context } from "koa";
import userService from "../services/user.service";
import md5Password from "@/utils/md5_password";
import fs from "fs";
import jwt from "jsonwebtoken";
import {
  Autho_INFO_ERROR,
  NOT_BRING_TOKEN,
  PASSWORD_ERROR,
  PHONE_OR_PASSWORD_IS_REQUIRED,
  PHONENUMBER_HAS_BEEN_LOGINED,
  USER_NOT_EXISTS,
} from "@/config/constants";
import { IRequestBody } from "@/type";

//注册验证
export const verify = async (ctx: Context, next: any) => {
  const { phone, password } = ctx.request.body as IRequestBody;
  //判断用户名或密码是否为空
  if (!phone || !password) {
    return ctx.app.emit("error", PHONE_OR_PASSWORD_IS_REQUIRED, ctx);
  }

  //判断手机号是否被注册过
  if ((await userService.findUser(phone)).length) {
    return ctx.app.emit("error", PHONENUMBER_HAS_BEEN_LOGINED, ctx);
  }
  await next();
};

//密码加密
export const handelPassword = async (ctx: Context, next: any) => {
  const body = ctx.request.body as any;
  const password = body.password as string;
  body.password = md5Password(password);
  await next();
};

//登录验证
export const verifyLogin = async (ctx: Context, next: any) => {
  const { phone, password } = ctx.request.body as IRequestBody;
  //判断用户名或密码是否为空
  if (!phone || !password) {
    return ctx.app.emit("error", PHONE_OR_PASSWORD_IS_REQUIRED, ctx);
  }
  //判断用户名是否存在于数据库
  if (!(await userService.findUser(phone)).length) {
    return ctx.app.emit("error", USER_NOT_EXISTS, ctx);
  }
  //判断密码是否正确
  const truePassword = await userService.findPassword(phone);
  if (!(md5Password(password) === truePassword)) {
    return ctx.app.emit("error", PASSWORD_ERROR, ctx);
  }

  await next();
};

//用户信息验证
export const verifyAuth = async (ctx: Context, next: any) => {
  const publicKey = fs.readFileSync("./src/config/keys/public.key");
  const authorization = ctx.header.authorization;
  if (!authorization) {
    return ctx.app.emit("error", NOT_BRING_TOKEN, ctx);
  }
  const token = decodeURIComponent(authorization).replace("Bearer ", "");

  // 解码
  try {
    const result = jwt.verify(token, publicKey) as any;
    const res = await userService.findUser(result.phone);
    ctx.user = {
      ...res[0],
    };
    ctx.user.avatar = `${ctx.origin}/${ctx.user.avatar}`;
  } catch (error) {
    return ctx.app.emit("error", Autho_INFO_ERROR, ctx);
  }
  await next();
};
