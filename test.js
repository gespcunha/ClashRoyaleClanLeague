var a = ["a", "b", "c", "d"]
var b = ["a", "b", "d"]

a = a.filter( ( el ) => b.includes( el ) );

console.log(a)