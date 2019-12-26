module.exports = function() {

    const createCsvWriter = require('csv-writer').createObjectCsvWriter;

    return {
        parse: parse
    }

    function parse(data, header, fileName) {  
        const csvWriter = createCsvWriter({
            path: 'csv/' + fileName,
            header: header
        });
        csvWriter.writeRecords(data).then(() => console.log('The CSV file was written successfully'));
    }
}