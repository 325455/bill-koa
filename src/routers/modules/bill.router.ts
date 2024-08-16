import koaRouter from "@koa/router";
import billController from "@/controllers/bill.controller";
import { verifyAuth } from "@/middlewares/user.middleware";

const billRouter = new koaRouter({ prefix: "/bill" });

//添加账单
billRouter.post("/addBill", verifyAuth, billController.create);
//获取某条账单
billRouter.get("/getBill/:billId", billController.getBill);
//获取某月的账单列表
billRouter.get(
  "/getBillList/:billType/:time",
  verifyAuth,
  billController.getBillList
);
//删除账单
billRouter.delete("/:billId", billController.delete);
//修改账单
billRouter.patch("/updateBill/:billId", billController.update);

export default billRouter;
