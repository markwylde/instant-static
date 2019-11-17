const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const InstantStatic = require('../index.js');
const is = new InstantStatic();

is.addModule(require('../modules/blog'));

is.addTheme('blog/index.ejs', fs.readFileSync(path.resolve(__dirname, '../theme/blog/post.ejs'), 'utf8'));
is.addTheme('layouts/main.ejs', fs.readFileSync(path.resolve(__dirname, '../theme/layouts/main.ejs'), 'utf8'));
is.addTheme('shop/category.ejs', fs.readFileSync(path.resolve(__dirname, '../theme/shop/category.ejs'), 'utf8'));
is.addTheme('shop/product.ejs', fs.readFileSync(path.resolve(__dirname, '../theme/shop/product.ejs'), 'utf8'));

is.addSettings(yaml.load(fs.readFileSync(path.resolve(__dirname, './settings.yml'), 'utf8')));

is.addAsset('/images/blog-banner.jpg', fs.readFileSync(path.resolve(__dirname, './images/blog-banner.jpg')));
is.addAsset('/css/global.css', fs.readFileSync(path.resolve(__dirname, '../theme/css/global.css')));

is.addContent({
  module: 'blog',
  id: 'my-first-post',
  title: 'My First Post',
  date: '2016-05-15 10:51',
  banner: '/images/blog-banner.jpg',
  tags: ['First'],
  type: 'markdown',
  content: `
## First Post

Sometimes I just want to tell people this is my second post when actually this is my first
  `
});

is.addContent({
  module: 'blog',
  id: 'my-second-post',
  title: 'My second Post',
  date: '2016-05-15 10:51',
  banner: '/images/blog-banner.jpg',
  tags: ['Second'],
  type: 'markdown',
  content: `
## Second Post

Sometimes I just want to tell people this is my first post when actually this is my second
  `
});

const compiled = is.compile();

/*
  Example web server to deliver compiled content
*/
const http = require('http');
http.createServer(function (req, res) {
  console.log(compiled);
  const page = compiled.filter(page => page.path === req.url)[0];
  if (page) {
    res.writeHead(200, {
      'Content-Type': page.type
    });
    res.write(page.data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/text'
    });
    res.write('Page not found');
  }

  res.end();
}).listen(8080);
console.log('Listening on post 8080');
