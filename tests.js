













all = [
    {"name": "joao",    "age": 10},
    {"name": "miguel",  "age": 20},
    {"name": "pedro",   "age": 30},
]

inClan = [
    {"name": "joao"},
    {"name": "miguel"},
    {"name": "sergio"}
]

for (var i = all.length-1; i >= 0; i--) {
    var found = false
    for (var j = 0; j < inClan.length; j++) {
        console.log("comparing " + all[i].name + " with " + inClan[j].name)
        if (all[i].name == inClan[j].name) {
            found = true
            break
        }            
    }
    if (!found)
        all.splice(i,1)
}

console.log(all)