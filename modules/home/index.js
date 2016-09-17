const fs = require('fs-promise')
const render = require('../../utils/render').default

module.exports = {
  render: async ({posts, products}) => {
    const compiled = await render('./theme/layouts/main.ejs', {
      title: 'Welcome',
      content: await render('./theme/blog/home.ejs', { posts, products })
    })

    fs.writeFile('./dist/index.html', compiled)
  }
}