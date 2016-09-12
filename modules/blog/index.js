const fs = require('fs-promise')
const yaml = require('js-yaml')
const marked = require('marked')

module.exports = {
  fetchPosts: async function() {
    const files = await fs.readdir('./content/posts/')
    const posts = await Promise.all(
      files.map(async file =>
        fs.readFile('./content/posts/' + file, 'utf8')
          .then(post => `id: ${file.slice(0,-4)}\n${post}`)
          .then(post => yaml.load(post))
          .then(post => {
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