import { Context } from "koa";

import connection from "../config/database";
import { RowDataPacket } from "mysql2";

class UserService {
  //存入用户
  async save(ctx: Context) {
    const { phone, password } = ctx.request.body as any;
    const saveSql = `INSERT INTO user (Phone, Password,avatar,signature,create_at)
     VALUES (?,  ?,'default.jpg','竹杖芒鞋轻胜马',${+new Date()});`;
    const [res] = await connection.execute(saveSql, [phone, password]);
    return res;
  }

  //查询用户
  async findUser(phone: string) {
    const findSql = `select phone,username,avatar,signature,create_at from user where phone=?`;
    const [values] = await connection.execute<RowDataPacket[]>(findSql, [
      phone,
    ]);
    return values;
  }

  //查询密码
  async findPassword(phone: string) {
    const findSql = `select password from user where phone=?`;
    const [value] = await connection.execute<RowDataPacket[]>(findSql, [phone]);
    return value[0].password;
  }

  //修改用户信息
  async changeUserInfo(ctx: Context) {
    const { phone } = ctx.user;
    const { username, signature } = ctx.request.body as any;
    if (!ctx.file) {
      const statement = `update user set username=?,signature=? where phone=?`;
      const res = await connection.execute(statement, [
        username,
        signature,
        phone,
      ]);
      return res[0];
    }
    const avatar = ctx.file.filename;
    const statement = `update user set username=?,signature=?,avatar=? where phone=?`;
    const res = await connection.execute(statement, [
      username,
      signature,
      avatar,
      phone,
    ]);
    return res[0];
  }

  //修改密码
  async changePassword(phone: string, newPassword: string) {
    const statement = `update user set password=? where phone=?`;
    const res = await connection.execute(statement, [newPassword, phone]);
    return res[0];
  }
}

export default new UserService();
