module.exports = function(fs) {
    var dir = './csv/'

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    return {
        createFile: createFile,
        readFile: readFile,
        arrayToCsv: arrayToCsv,
        csvToArray: csvToArray,
        getHeadersUpperCased: getHeadersUpperCased,
        dir: dir
    }

    // return 0 - success
    // return 1 - error
    function createFile(data, filePath) {
        return new Promise(function(resolve, reject) {
            fs.writeFile(dir + filePath, data, function (err) {
                if (err) 
                    reject(`File ${dir + filePath} does't exist or is opened.`)
                
                resolve(`Saved in ${dir + filePath}`)
            })
        })
    }

    // return 0 - success
    // return 1 - error
    function readFile(filePath) {
        return new Promise(function(resolve, reject) {
            fs.readFile(dir + filePath, (err, data) => { 
                if (err) 
                    reject(`File ${dir + filePath} doesn't exist or is opened.`)
                    
                resolve(data)
            })
        })
    }

    function csvToArray(arr) {
        var jsonObj = [];
        var headers = arr[0].split(',');
        for (var i = 1; i < arr.length; i++) {
            var data = arr[i].split(',');
            var obj = {};
            for (var j = 0; j < data.length; j++) {
                var propertyName = headers[j].trim().toLowerCase()
                var value = null
                if (propertyName != "name")
                    value = parseInt(data[j].trim())
                else 
                    value = data[j].trim()
                
                obj[propertyName] = value
            }
            jsonObj.push(obj);
        }
        return jsonObj
    }

    function arrayToCsv(objArray, headers) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '\uFEFF' + headers;

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') 
                    line += ','

                line += array[i][index];
            }
            str += line
            if (i != array.length-1)
                str += '\n';
        }
        return str;
    }

    // returns object properties uppercased and splited by ,
    function getHeadersUpperCased(array) {
        var props = Object.keys(array[0])
        var result = ''
        for (let i = 0; i < props.length-1; i++){
            result += props[i].toUpperCase() + ","
        }
    
        result += props[props.length-1].toUpperCase() + "\n"
        return result
    }
}