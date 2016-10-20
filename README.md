# instant-static
Build a static website from YAML files to create a blog or information website.

## Build included sample
This project comes with an `example` folder that you can build.

### Using the CLI
```shell
instant-static -d example -o dist
```

### Using node
```javascript
const is = require('instant-static')
const blog = require('instant-static-blog')
const shop = require('instant-static-shop')

is.addModules(blog, shop)

is.includeAssets('example/images')
is.includeContent('example/blog')
is.includeContent('example/shop')

is.addContent(`
  module: blog
  title: My Node Post from YAML
  date: 2016-06-15 10:51
  banner: /images/blog-banner.jpg
  tags: 
    - Node
    - Additional
  type: markdown
  content: >
    ## Node Post
    
    This post was inserted by node systematically
`)

is.addContent({
  module: 'blog',
  title: 'My Node Post from JSON',
  date: '2016-06-15 10:51',
  banner: '/images/blog-banner.jpg',
  tags: ['Node', 'Additional'],
  type: 'markdown',
  content: `
    ## Node Post
    
    This post was inserted by node systematically`
}, 'blog')

const build = is.compile()
build.save('dist')

```


