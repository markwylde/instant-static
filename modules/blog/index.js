const fs = require('fs-promise')
const yaml = require('js-yaml')
const marked = require('marked')
const moment = require('moment')
const render = require('../../utils/render').default
const mkdirp = require('mkdirp-promise')

module.exports = {
  path: post => `./dist/${moment(post.date).format('YYYY/MM/DD')}/${post.id}`,

  fetchPosts: async settings => {
    let files = await fs.readdir('./content/blog/')
    files = files.filter(file => file.substr(-4) === '.yml')

    const posts = await Promise.all(
      files.map(async file =>
        fs.readFile('./content/blog/' + file, 'utf8')
          .then(post => `id: ${file.slice(0,-4)}\n${post}`)
          .then(post => yaml.load(post))
          .then(post => {
            post.date = new Date(post.date)
            post.path = `${settings.url}${moment(post.date).format('YYYY/MM/DD')}/${post.id}`
            if (post.type === 'markdown') {
              post.content = marked(post.content)
              return post
            } else {
              return post
            }
          })
      )
    )
    return posts
  },

  renderPost: async post => {
    const compiled = await render('./theme/layouts/main.ejs', {
      title: post.title,
      content: await render('./theme/blog/post.ejs', { post }),
    })
    const path = module.exports.path(post)
    await mkdirp(path)
    return fs.writeFile(`${path}/index.html`, compiled)
  }

}