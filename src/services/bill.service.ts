import { RowDataPacket } from "mysql2";
import connection from "@/config/database";
import { Context } from "koa";
import dayjs from "dayjs";

interface IBill {
  billId: number;
  billType: string;
  createAt: string;
  money: number;
  remark: string;
}

class billService {
  //添加账单
  async save(ctx: Context) {
    const { phone } = ctx.user;
    const { money, billType, remark, createAt } = ctx.request.body as any;
    const statement = `insert into bill (phone,money,createAt,billType,remark) values (?,?,?,?,?)`;
    const res = await connection.execute(statement, [
      phone,
      money,
      createAt,
      billType,
      remark,
    ]);
    return res[0];
  }
  //删除账单
  async delete(ctx: Context) {
    const { billId } = ctx.params;
    const statement = `delete from bill where billId=${billId}`;
    const res = connection.execute(statement);
    return res;
  }
  //获取某条账单
  async getBill(ctx: Context) {
    const { billId } = ctx.params;
    console.log(billId);

    const statement = `select * from bill where billId = ${billId}`;
    const [res] = await connection.execute<any>(statement);
    return res[0];
  }
  //查询账单列表
  async getBillList(ctx: Context) {
    let returnList: any[];
    const monthTotal = { expense: 0, income: 0 };
    const { billType, time } = ctx.params;
    const { phone } = ctx.user;
    //该月的所有账单
    let [allBill] = await connection.execute<any[]>(
      `select billId,money,createAt,billType,remark from bill where phone=?`,
      [phone]
    );
    const requiredMonth = dayjs(+time).format("YYYY-MM");
    allBill = allBill.filter(
      (item: any) => dayjs(+item.createAt).format("YYYY-MM") === requiredMonth
    );
    //该月的收支和
    allBill.forEach((bill: IBill) => {
      if (bill.billType === "收入") {
        monthTotal.income += bill.money;
      } else {
        monthTotal.expense += bill.money;
      }
    });
    //待返回的账单列表
    if (billType === "全部类型") {
      returnList = allBill;
    } else {
      returnList = allBill.filter((bill: IBill) => bill.billType === billType);
    }
    return { monthTotal, returnList };
  }
  //修改账单
  async updateBill(ctx: Context) {
    const { billId } = ctx.params;
    const { money, createAt, billType, remark } = ctx.request.body as any;
    const statement = `UPDATE bill SET money = ?, createAt = ?, billType = ?, remark = ? WHERE billId = ?`;
    const res = await connection.execute(statement, [
      money,
      createAt,
      billType,
      remark,
      billId,
    ]);
    return res;
  }
}

export default new billService();
