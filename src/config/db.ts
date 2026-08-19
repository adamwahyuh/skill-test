import "dotenv/config"
import { Pool } from "pg";

const db : object = new Pool({
    host : process.env.PGHOST,
    port : Number(process.env.PGPORT),
    user : process.env.PGUSER,
    password : process.env.PGPASSWORD,
    database : process.env.PGNAME,
})
export default db