import { EventEmitter } from "events"
import { get } from "https"
import { STATUS_CODES } from "http"

/**
 * An EventEmitter to get a Treehouse students profile.
 * @param username
 * @constructor
 */
export class Profile extends EventEmitter {
  constructor(username) {
    super()
    //Connect to the API URL (https://teamtreehouse.com/username.json)
    const request = get(
      `https://teamtreehouse.com/${username}.json`,
      (response) => {
        let body = ""

        if (response.statusCode !== 200) {
          request.abort()
          //Status Code Error
          this.emit(
            "error",
            new Error(
              `There was an error getting the profile for ${username}. (${
                STATUS_CODES[response.statusCode]
              })`
            )
          )
        }

        //Read the data
        response.on("data", (chunk) => {
          body += chunk
          this.emit("data", chunk)
        })

        response
          .on("end", () => {
            if (response.statusCode === 200) {
              try {
                //Parse the data
                const profile = JSON.parse(body)
                this.emit("end", profile)
              } catch (error) {
                this.emit("error", error)
              }
            }
          })
          .on("error", (error) => {
            this.emit("error", error)
          })
      }
    )
  }
}
