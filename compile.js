const ejs = require('ejs')
const fs = require('fs-extra-promise')
const rimraf = require('rimraf-promise')
const blog = require('./modules/blog')
const ncp = require('ncp').ncp
const moment = require('moment')
const mkdirp = require('mkdirp-promise')
const yaml = require('js-yaml')

let settings, templates = {}

async function render(file, scope) {
  if (!templates[file]) {
    templates[file] = await fs.readFileAsync(file, 'utf8')
  }
  const template = templates[file]
  return ejs.render(template, Object.assign(scope, {moment, settings}))
}

async function main() {

  await rimraf('./dist')
  await fs.mkdir('./dist')

  settings = await fs.readFileAsync('./content/settings.yml', 'utf8')
  settings = yaml.load(settings)

  await fs.copySync('./theme/css', './dist/css')

  const posts = await blog.fetchPosts(settings)
  
  await Promise.all([
    renderPosts(posts),
    renderHomePage(posts)
  ])

  // -----------------------------------------------

  async function renderPosts(posts) {
    return Promise.all(posts.map(renderPost))
  }

  async function renderPost(post) {
      const compiled = await render('./theme/layouts/main.ejs', {
        title: post.title,
        content: await render('./theme/blog/post.ejs', { post }),
      })
      const path = `./dist/${moment(post.date).format('YYYY/MM/DD')}/${post.id}`
      await mkdirp(path)
      return fs.writeFile(`${path}/index.html`, compiled)
  }


  async function renderHomePage(posts) {
    const compiled = await render('./theme/layouts/main.ejs', {
      title: "Welcome",
      content: await render('./theme/blog/home.ejs', { posts })
    })

    fs.writeFile('./dist/index.html', compiled)
  }


}

main().catch(console.log)
