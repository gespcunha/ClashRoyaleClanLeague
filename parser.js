module.exports = function(fs) {

    var dir = './csv/';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    return {
        createFile: createFile,
        readFile: readFile,
        arrayToCsv: arrayToCsv,
        csvToArray: csvToArray
    }

    function createFile(data, filePath) {
        fs.writeFile(dir + filePath, data, function (err) {
            if (err) 
                throw err;
            console.log('Saved!');
        });
    }

    function readFile(filePath, callback) {
        fs.readFile(dir + filePath, (err, data) => { 
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
                obj[headers[j].trim().toLowerCase()] = data[j].trim();
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
}