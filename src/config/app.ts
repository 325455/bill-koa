import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import registerRouter from "../routers";
import serve from "koa-static";
import path from "path";

const app = new Koa();

app.use(bodyParser());
app.use(serve(path.resolve(__dirname, "../../static")));

app.use(
  cors({
    origin: "*", // 允许所有来源
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // 允许的请求方法
    headers: ["Content-Type", "Authorization"], // 允许的请求头
  })
);

registerRouter(app);

export default app;
