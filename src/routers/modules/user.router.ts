import koaRouter from "@koa/router";
import userController from "@/controllers/user.controller";
import {
  handelPassword,
  verify,
  verifyAuth,
  verifyLogin,
} from "@/middlewares/user.middleware";
import { uploadAvatar } from "@/middlewares/file.middleware";

const userRouter = new koaRouter({ prefix: "/user" });

userRouter.post("/signUp", verify, handelPassword, userController.create);
userRouter.post("/signIn", verifyLogin, userController.signIn);
userRouter.get("/getUserInfo", verifyAuth, userController.getUserInfo);
userRouter.post(
  "/changeUserInfo",
  verifyAuth,
  uploadAvatar,
  userController.changeUserInfo
);
userRouter.post("/changePassword", verifyAuth, userController.changePassword);

export default userRouter;
