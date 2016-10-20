class InstantStatic {

  constructor() {
    this.modules = {}
    this.content = []
    this.themes = {}
    this.assets = {}
  }

  addModules(modules) {
    this.modules = modules.reduce(
      (acc, arg) => Object.assign(acc, {[arg.name]: arg})
    , this.modules)
  }

  addModule(module) {
    this.modules = Object.assign(this.modules, {[module.name]: module })
  }

  addContent() {
    this.content = this.content.concat([].slice.call(arguments))
  }

  addTheme(path, content) {
    this.themes[path] = content
  }

  addAsset(path, data) {
    this.assets[path] = data
  }

  addSettings(settings) {
    this.settings = settings
  }

  compile() {
    let result = []
    for (let module in this.modules) {
      result = result.concat(this.modules[module].parse(this))
    }

    for (let asset in this.assets) {
      result = result.concat([{
        path: asset,
        type: 'binary',
        data: this.assets[asset]
      }])
    }



    return result
  }

}

module.exports = InstantStatic