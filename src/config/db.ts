import "dotenv/config"
import { Pool } from "pg";

const db : Pool = new Pool({
    host : process.env.PGHOST,
    port : Number(process.env.PGPORT),
    user : process.env.PGUSER,
    password : process.env.PGPASSWORD,
    database : process.env.PGDATABASE,
})
export default db