const fs = require('fs')

fs.readFile('config.txt', (err, data) => { 
    if (err) {
        console.log("File not found.")
        return
    }
    
    values = dataToObject(data.toString().split("\n"))
    console.log(values)
})

// Returns array with key:value objects
function dataToObject(data) {
    var values = {}
    data.forEach(element => {
        if (element.includes(':')) {
            var temp = element.split(':')
            values[temp[0]] = parseInt(temp[1].trim())
        }
    });
    return values
}