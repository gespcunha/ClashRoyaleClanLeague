module.exports = function(fs, chalk) {

    if (!fs) 
        throw "Invalid fs."

    if (!chalk) 
        throw "Invalid chalk."

    var dir = './csv/';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    return {
        createFile: createFile,
        readFile: readFile,
        arrayToCsv: arrayToCsv,
        csvToArray: csvToArray,
        getHeadersUpperCased: getHeadersUpperCased
    }

    function createFile(data, filePath) {
        fs.writeFile(dir + filePath, data, function (err) {
            if (err) 
                throw err;
            console.log(chalk.green(`Saved in ${dir + filePath}`))
        });
    }

    function readFile(filePath, callback) {
        var fullPath = dir + filePath
        if (!fs.existsSync(fullPath)) {
            console.log(chalk.red.bold(`File ${fullPath} doesn't exist.`))
            return
        } 
        fs.readFile(fullPath, (err, data) => { 
            if (err) 
                throw err; 
            callback(data)
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