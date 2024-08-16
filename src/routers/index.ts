import fs from "fs";
import path from "path";
import Application from "koa";

const registerRouter = async (app: Application) => {
  const routers = fs.readdirSync(path.resolve(__dirname, "./modules"));
  for (const router of routers) {
    if (router.endsWith(".router.ts")) {
      const currentRouter = (await import(`./modules/${router}`)).default;
      app.use(currentRouter.routes());
    }
  }
};

export default registerRouter;
