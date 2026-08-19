import "dotenv/config"
import http from "http"
import app from "./app"

const PORT :number = Number(process.env.APP_PORT) || 3000
const HOST : string = process.env.APP_HOST || "127.0.0.1"

const server = http.createServer(app)

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
})