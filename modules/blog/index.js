// const fs = require('fs-promise')
// const yaml = require('js-yaml')
const marked = require('marked')
// const render = require('../../utils/render').default
// const mkdirp = require('mkdirp-promise')

const ejs = require('ejs')
const moment = require('moment')
const groupBy = require('../../utils/groupBy.js')

module.exports = {

  name: 'blog',
  parse: inst =>
     inst.content
        .filter(content => content.module === 'blog')
        .map(post => ({
          path: `/${moment(post.date).format('YYYY/MM/DD')}/${post.id}`,
          type: 'html',
          data: ejs.render(inst.themes['blog/index.ejs'], {
            settings: inst.settings,
            post: Object.assign(post, { content: marked(post.content)}),
            moment, 
            groupBy
          })
        }))
}