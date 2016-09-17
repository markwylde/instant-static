const fs = require('fs-extra-promise')
const ejs = require('ejs')
const moment = require('moment')
const yaml = require('js-yaml')
const groupBy = require('./groupBy').default

let templates = {}
let settings = fs.readFile('./content/settings.yml', 'utf8')
settings = yaml.load(settings)

async function render(file, scope) {
  if (!templates[file]) {
    templates[file] = await fs.readFileAsync(file, 'utf8')
  }
  const template = templates[file]
  return ejs.render(template, Object.assign(scope, {moment, settings, groupBy}))
}
export default render