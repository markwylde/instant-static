const fs = require('fs-extra-promise')
const rimraf = require('rimraf-promise')
const blog = require('./modules/blog')
const shop = require('./modules/shop')
const home = require('./modules/home')
const yaml = require('js-yaml')
const groupBy = require('./utils/groupBy').default

async function main() {

  await rimraf('./dist')
  await fs.mkdir('./dist')

  await fs.copySync('./theme/css', './dist/css')
  await fs.copySync('./content/images', './dist/images')

  const settings = yaml.load(await fs.readFileAsync('./content/settings.yml', 'utf8'))
  const posts = await blog.fetchPosts(settings)
  const products = await shop.fetchProducts(settings)
  const categories = groupBy('category', products)

  await Promise.all([
    posts.map(blog.renderPost),
    categories.map(shop.renderCategory),
    products.map(shop.renderProduct),

    home.render({posts, products})
  ])
}

main().catch(console.error)
