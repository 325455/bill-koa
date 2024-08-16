import { Context } from "koa";
import billService from "../services/bill.service";
import { UNKNOWN_ERROR } from "@/config/constants";

class billContraller {
  async create(ctx: Context) {
    try {
      await billService.save(ctx);
      return (ctx.body = {
        code: "0",
        message: "账单添加成功",
      });
    } catch (err) {
      ctx.err = err;
      ctx.app.emit("error", UNKNOWN_ERROR, ctx);
    }
  }
  async delete(ctx: Context) {
    const res = await billService.delete(ctx);
    return (ctx.body = {
      code: "0",
      res,
    });
  }
  async getBill(ctx: Context) {
    const res = await billService.getBill(ctx);
    return (ctx.body = {
      code: "0",
      bill: res,
    });
  }
  async getBillList(ctx: Context) {
    const res = await billService.getBillList(ctx);
    ctx.body = {
      code: "0",
      monthTotal: res.monthTotal,
      list: res.returnList,
    };
  }
  async update(ctx: Context) {
    try {
      const res = await billService.updateBill(ctx);
      return (ctx.body = {
        code: "0",
        res,
        message: "账单修改成功",
      });
    } catch (err) {
      ctx.err = err;
      ctx.app.emit("error", UNKNOWN_ERROR, ctx);
    }
  }
}

export default new billContraller();
