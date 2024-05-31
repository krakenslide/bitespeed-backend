// import { Pool } from "pg";
//
// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
// });
//
// export default {
//   query: (text: string, params?: any[]) => pool.query(text, params),
// };

import { createConnection } from "typeorm";
import { ContactEntity } from "../entities/contact.entity";

export const connectDatabase = async () => {
  await createConnection({
    type: "postgres",
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities: [ContactEntity],
    synchronize: true,
    logging: false,
  });
  console.log("Database connected");
};
