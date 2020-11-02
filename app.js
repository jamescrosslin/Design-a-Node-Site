import { css, home, user } from "./router.js"

//Problem: We need a simple way to look at a user's badge count and JavaScript points from a web browser

//Solution: Use Node.js to perform the profile look ups and serve our template via HTTP

// Create a web server
import { createServer } from "http"

const hostname = "127.0.0.1"
const port = 3000

const server = createServer((request, response) => {
  css(request, response)
  if (!response.headersSent) {
    home(request, response)
  }
  if (!response.headersSent) {
    user(request, response)
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
