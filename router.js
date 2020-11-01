const Profile = require("./profile.js")
const renderer = require("./renderer")
const querystring = require("querystring")
const commonHeaders = ["Content-Type", "text/html"]
const fs = require("fs")

function css(request, response) {
  if (request.url.indexOf(".css") !== -1) {
    let fileContents = fs.readFileSync("./css/styles.css", { encoding: "utf8" })
    response.write(fileContents)
    response.end()
  }
}

// Handle the http route GET / and POST / i.e. Home
function home(request, response) {
  //if the url == "/" && GET
  if (request.url === "/") {
    if (request.method.toLowerCase() === "get") {
      //show
      response.statusCode = 200
      response.setHeader(...commonHeaders)
      renderer.view(`header`, {}, response)
      renderer.view(`search`, {}, response)
      renderer.view(`footer`, {}, response)
      response.end()
    } else {
      //if url == '/' && POST
      // get the post data from body
      request.on("data", (postBody) => {
        //extract the username
        response.statusCode = 303
        let query = querystring.parse(postBody.toString())
        response.setHeader(`Location`, `/${query.username}`)
        response.end()
        //redirect to /:username
      })
    }
  }
}

// Handle the HTTP route GET /:username i.e. /jamescrosslin
function user(request, response) {
  // if ure == "/...."
  const username = request.url.replace("/", "")
  if (username.length > 0) {
    response.statusCode = 200
    response.setHeader(...commonHeaders)
    renderer.view(`header`, {}, response)

    //get json from Treehouse
    const studentProfile = new Profile(username)
    //on end
    studentProfile.on("end", (profileJSON) => {
      //show profile

      // Store needed values
      const values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }

      // simple response

      renderer.view(`profile`, values, response)
      renderer.view(`footer`, {}, response)
      response.end()
    })

    //on "error"
    studentProfile.on("error", (error) => {
      //show error
      renderer.view(`error`, { errorMessage: error.message }, response)
      renderer.view(`search`, {}, response)
      renderer.view(`footer`, {}, response)
      response.end()
    })
  }
}
module.exports.css = css
module.exports.home = home
module.exports.user = user
