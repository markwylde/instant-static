const fs = require('fs-promise')
const yaml = require('js-yaml')
const marked = require('marked')
const render = require('../../utils/render').default
const mkdirp = require('mkdirp-promise')

module.exports = {
  path: product => `./dist/${product.category}/${product.id}`,

  fetchProducts: async function(settings) {
    const files = await fs.readdir('./content/shop/')
    const products = await Promise.all(
      files.map(async file =>
        fs.readFile('./content/shop/' + file, 'utf8')
          .then(product => `id: ${file.slice(0,-4)}\n${product}`)
          .then(product => yaml.load(product))
          .then(product => {
            product.date = new Date(product.date)
            product.path = `${settings.url}${product.category}/${product.id}`
            if (product.type === 'markdown') {
              product.content = marked(product.content)
              return product
            } else {
              return product
            }
          })
      )
    )
    return products
  },

  renderProduct: async product => {
    const compiled = await render('./theme/layouts/main.ejs', {
      title: product.name,
      content: await render('./theme/shop/product.ejs', { product }),
    })
    const path = module.exports.path(product)
    await mkdirp(path)
    return fs.writeFile(`${path}/index.html`, compiled)
  },

  renderCategory: async category => {
    const compiled = await render('./theme/layouts/main.ejs', {
      title: category.name,
      content: await render('./theme/shop/category.ejs', { category }),
    })
    const path = `./dist/${category.id}`
    await mkdirp(path)
    return fs.writeFile(`${path}/index.html`, compiled)
  }
}