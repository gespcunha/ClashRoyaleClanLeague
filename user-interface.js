module.exports = function(chalk) {

    const readline = require('readline')

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    let readWriteOptions = [
        {id: 1, word: "Read", handler: readWriteHandler},
        {id: 2, word: "Write", handler: readWriteHandler},
        {id: 3, word: "Back", handler: backHandler}
    ]
    
    var criterias

    return {
        startUI: startUI
    }

    function readWriteHandler(handler, readWrite) { handler(readWrite) }
    function backHandler() { showCriterias() }

    function startUI(handlers) {
        criterias = handlers

        // 1 - criterias menu
        // 2 - read / write menu
        var menu = 1
        var criteriaObj
        showCriterias()
        rl.on('line', function(line) {
            if (menu == 1) {
                criteriaObj = handlers.find(element => element.id == line)
                if (!criteriaObj)
                    showError("Invalid value. Try again.")
                else {
                    menu = 2
                    showReadWriteOptions()
                }
            }
            else {
                var readWriteOptionsObj = readWriteOptions.find(element => element.id == line)
                if (!readWriteOptionsObj)
                    showError("Invalid value. Try again.")
                else {
                    var word = readWriteOptionsObj.word
                    readWriteOptionsObj.handler(criteriaObj.handler, word)
                    if (readWriteOptionsObj.word == "Back")
                        menu = 1
                    else 
                        rl.close()
                }
            }
        })
    }
    
    function showCriterias() {
        console.log(chalk.blue.bold("\n\tCRITERIAS\n"))
        showOptions(criterias, "criteria")
        showQuestion("Which criteria do you want?")
    }

    function showReadWriteOptions() {
        showOptions(readWriteOptions, "word")
        showQuestion("Read, Write or go back?")
    }

    function showQuestion(question) {
        console.log(chalk.yellow(`\n\t${question}\n`))
    }

    function showError(errMessage) {
        console.log(chalk.red.bold(errMessage))
    }

    function showOptions(obj, word) {
        obj.forEach(element => console.log(element.id + " -> " + element[word]))
    }
}