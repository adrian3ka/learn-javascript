const Bacon = require('baconjs')
const stream = new Bacon.Bus() //Stream on Baconjs

stream.map(word => word.toUpperCase())
      .onValue(word => console.log(word))


stream.push('cat')
stream.push('meal')
stream.push('trumpet')
