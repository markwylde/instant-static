const ejs = require('ejs')
const fs = require('fs')
const fsp = require('fs-promise')
const rimraf = require('rimraf')
const blog = require('./modules/blog')
const ncp = require('ncp').ncp

// Empty or create the dist directory
rimraf('./dist', async () => {
  await fsp.mkdir('./dist')
  const posts = await blog.fetchPosts()
  copyAssets()
  renderPosts(posts)
  renderHomePage(posts)
})

async function copyAssets() {
  return new Promise((resolve, reject) => {
    ncp('./theme/css', './dist/css', function (err) {
     if (err) {
        reject(err)
     } else {
        resolve()
     }
    })
  })
}

async function renderPosts(posts) {
  const mainLayout = fs.readFileSync('./theme/layouts/main.ejs', 'utf8')
  const postPage = fs.readFileSync('./theme/pages/post.ejs', 'utf8')

  return Promise.all(posts.map(post => {
    const compiled = ejs.render(mainLayout, {
      title: post.title,
      content: ejs.render(postPage, { post })
    })

    return fsp.writeFile('./dist/' + post.id + '.html', compiled)
  }))

}


function renderHomePage(posts) {
  const mainLayout = fs.readFileSync('./theme/layouts/main.ejs', 'utf8')
  const homePage = fs.readFileSync('./theme/pages/home.ejs', 'utf8')

  const compiled = ejs.render(mainLayout, {
    title: "Welcome",
    content: ejs.render(homePage, {
      posts: posts
    })
  })

  fsp.writeFile('./dist/index.html', compiled)
}
