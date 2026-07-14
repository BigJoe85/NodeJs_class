// file system module

// synchronous method, this will block the event loop until the file is read and the content is returned, which can lead to performance issues if the file is large or if there are multiple requests to read files at the same time.

import fs from 'fs';

let textContent = fs.readFileSync('text.txt', 'utf-8');
console.log(textContent);

//Write file synchronously
let content = "This is some new content for the file.";
fs.writeFileSync('text.txt', content, 'utf-8'); // This will overwrite the existing content of the file with the new content. If the file does not exist, it will be created.

//Append content to the file synchronously
//Appending content to a file means adding new content to the end of the existing content without overwriting it. This is useful when you want to keep the existing data in the file and add new information to it.

let content2 = "\nLets keep adding content to the file.";
fs.appendFileSync('text.txt', content2, 'utf-8'); // This will add the new content to the end of the existing content in the file. If the file does not exist, it will be created. The '\n' at the beginning of content2 ensures that the new content is added on a new line, preserving the readability of the file, rather than concatenating it directly to the end of the existing content.

// open file synchronously
let fileDescriptor = fs.openSync('text.txt', 'r'); // This opens the file in read mode and returns a file descriptor, which is a unique identifier for the opened file. The 'r' flag indicates that the file is being opened for reading. If the file does not exist, an error will be thrown.

// // close file synchronously
// fs.closeSync(fileDescriptor); // This closes the file associated with the given file descriptor. It is important to close files after opening them to free up system resources and avoid potential memory leaks.

//delete file synchronously
fs.unlinkSync('text2.txt'); // This deletes the file specified by the path. If the file does not exist, an error will be thrown. Use this method with caution, as it permanently removes the file from the filesystem.

//rename file synchronously
fs.renameSync('text.txt', 'newText.txt'); // This renames the file from 'text.txt' to 'newText.txt'. If the original file does not exist or if a file with the new name already exists, an error will be thrown.