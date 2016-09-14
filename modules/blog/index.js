const fs = require('fs-promise')
const yaml = require('js-yaml')
const marked = require('marked')
const moment = require('moment')

module.exports = {
  fetchPosts: async function(settings) {
    const files = await fs.readdir('./content/blog/')
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
  }
}