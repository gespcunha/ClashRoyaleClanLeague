module.exports = function(fs, chalk, Excel) {

    if (!fs) 
        throw "Invalid fs."

    if (!chalk) 
        throw "Invalid chalk."
    
    if (!Excel)
        throw "Invalid Excel."

    var dir = './excel/';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }

    return {
        createLeaderboard: createLeaderboard,
        createFixture: createFixture,
        readFile: readFile
    }
    
    // data - array of objects 
    // padding - number of columns to move forward
    function createLeaderboard(data, fileName, padding = 3) {
        var fullPath = dir + fileName
        const workbook = new Excel.Workbook()
        const worksheet = workbook.addWorksheet("Leaderboard")
    
        fillColumns(worksheet, data, padding)
        
        worksheet.eachRow(function(row, rowNumber) {
            row.eachCell(function(cell, colNumber) {
                let left = 'thin'
                let right = 'thin'
                let fgColor
    
                if (rowNumber == 1) {
                    fgColor = 'D3D3D3'
                    if (colNumber != 1 + padding)
                        left = ''
                    if (colNumber != Object.keys(data[0]).length + padding)
                        right = ''
                }
                else {
                    if (rowNumber >= 2 && rowNumber <= 5)
                        fgColor = '00FF00'
                    else if (rowNumber >= data.length - 2) 
                        fgColor = 'FF0000'
                }
    
                configCell(cell, left, right, fgColor) 
            })
        })
    
        workbook.xlsx.writeFile(fullPath)
            .then(function() { 
                console.log(chalk.green(`Saved in ${fullPath}`))
            })
            .catch(function() {
                console.log(chalk.red(`Close file ${fullPath}`))
            })
    }

    // data - array of objects 
    // padding - number of columns to move forward
    async function createFixture(data, fileName, padding = 3) {
        var fullPath = dir + fileName
        const workbook = new Excel.Workbook()
        const worksheet = workbook.addWorksheet("Fixture")
    
        fillColumns(worksheet, data, padding)
        
        worksheet.eachRow(function(row, rowNumber) {
            row.eachCell(function(cell, colNumber) {
                let left = 'thin'
                let right = 'thin'
                let fgColor
    
                if (rowNumber == 1) {
                    fgColor = 'D3D3D3'
                    if (colNumber != 1 + padding)
                        left = ''
                    if (colNumber != Object.keys(data[0]).length + padding)
                        right = ''
                }
                configCell(cell, left, right, fgColor)
            })
        })
    
        await workbook.xlsx.writeFile(fullPath)
        console.log(chalk.green(`Saved in ${fullPath}`))
    }
    
    function readFile(fileName, callback) {
        var fullPath = dir + fileName
        var workbook = new Excel.Workbook()
        workbook.xlsx.readFile(fullPath)
            .then(function() {
                var worksheet = workbook.getWorksheet('Leaderboard')
                let keys = []
                let result = []
                let first = true
                let firstCellAvailable 
                worksheet.eachRow(function(row, rowNumber) {
                    let obj = {}
                    row.eachCell(function(cell, cellNumber) {
                        if (first) {
                            firstCellAvailable = cellNumber
                            first = false
                        }
                        if (rowNumber == 1) 
                            keys.push(cell.value.toLowerCase())
                        else 
                            obj[keys[cellNumber-firstCellAvailable]] = cell.value
                    })
                    if (rowNumber != 1)
                        result.push(obj)
                })

                callback(result)
            })
            .catch(function() {
                console.log(chalk.red(`File ${fullPath} not found.`))
            })
    }

    function fillColumns(worksheet, data, padding) {
        let columns = []
        for (let i = 0; i < padding; i++)
            columns.push({})
            
        Object.keys(data[0]).forEach(key => {
            columns.push(
                {header: key.toUpperCase() , key: key, width: key.length + 4}
            )
        })
    
        worksheet.columns = columns
    
        for (let i = 0; i < data.length; i++) {
            let keys = Object.keys(data[i])
            let values = Object.values(data[i])
            let row = {}
            for (let j = 0; j < keys.length; j++) 
                row[keys[j]] = values[j]
            
            worksheet.addRow(row)
        }
    }
    
    function configCell(cell, left, right, fgColor) {
        cell.alignment = {vertical: 'center', horizontal: 'center' }
                
        cell.border = {
            top:    {style: 'thin'},
            bottom: {style: 'thin'},
            left:   {style: left},
            right:  {style: right}
        }
    
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fgColor}
        }
    }    
}