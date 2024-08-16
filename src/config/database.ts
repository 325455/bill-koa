import mysql, { ConnectionOptions } from "mysql2";

const access: ConnectionOptions = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "txpTXP123",
  database: "bill",
  connectionLimit: 6,
};

const connectPool = mysql.createPool(access);

connectPool.getConnection((err: any, connection: any) => {
  if (err) {
    console.log("数据库连接失败");
    return;
  }

  connection.connect((err: any) => {
    if (err) {
      console.log("无法与数据库进行交互");
    } else {
      console.log("可以与数据库进行正常交互");
    }
  });
});

const connection = connectPool.promise();

export default connection;
