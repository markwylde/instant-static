const R = require('ramda')
const changeCase = require('change-case')

const groupBy = (field, items) => {
  const grouped = R.groupBy(item => item[field])(items)
  return Object.keys(grouped).map(key => ({
    id: key,
    title: changeCase.titleCase(key),
    path: key,
    items: grouped[key]
  }))
}

module.exports = groupBy