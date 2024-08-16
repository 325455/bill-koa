import "module-alias/register";
import app from "@/config/app";
import "@/utils/handle-error";

//启动服务器
app.listen(8000, () => {
  console.log(`服务器成功在8000端口启动`);
});
