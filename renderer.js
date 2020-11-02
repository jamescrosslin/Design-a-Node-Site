import { readFileSync } from "fs"

function mergeValues(values, content) {
  // Cycle over the keys
  for (let key in values) {
    // Replace all {{key}} with the value from the values object
    content = content.replace(`{{${key}}}`, values[key])
  }
  //return merged content
  return content
}

export function view(templateName, values, response) {
  // Read from the template file
  let fileContents = readFileSync(`./views/${templateName}.html`, "utf-8")
  // Insert values in to the content
  fileContents = mergeValues(values, fileContents)
  // Write out the contents to the response
  response.write(fileContents)
}
