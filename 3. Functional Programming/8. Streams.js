const fs = require('fs')
const highland = require('highland')

highland(fs.createReadStream('customers.csv','utf-8'))
           .split()
           .map(line => line.split(','))
           .filter(function(customerData) {
               if (customerData[0] === '') {
                   return false;
               }
               return true;
           })
           .map(parts => ({
               name : parts[0],
               numPurchases: parts[1]
           }))
           .filter( customer => customer.numPurchases > 2)
           .map( customer => customer.name)
           .each(x => console.log('each : ' + JSON.stringify(x)));

const stupidNumberStream = {
    each : (callback) => {
        setTimeout(() => callback(1), 1000);
        setTimeout(() => callback(2), 2000);
        setTimeout(() => callback(3), 3000);
    }
}

stupidNumberStream.each(console.log)


