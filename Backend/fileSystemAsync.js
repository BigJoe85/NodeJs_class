// Reading files asynchronously
// Firstly inport fs from fs
import fs from "fs"

// secondly use the FileSystem Variable dot readFile method
fs.readFile('./text3.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
})


// writing content to a file asynchronously
let content = " i just coded my first script"
fs.writeFile('./text3.txt', content, err => err && console.log(err))

// Append content into an existing file with content asynchronously
let content2 = "\ni am adding this to a file"
fs.appendFile('./text3.txt', content2, err => err && console.log(err))

// rename a file asynchronously
// syntax ------  fs.rename('./file to be renamed', 'new file name', (err))
fs.rename('./text4.txt', 'text44.txt', err => err && console.log(err))

//Delete a file Asynchronously
fs.unlink('./text5.txt', err => err && console.log(err))


