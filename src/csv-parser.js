const fs = require('fs');
const NEWLINE_CHAR = '\r\n';

/**
 * Reads a file from the filesystem
 * @param {*} filePath 
 * @returns String file Content
 */
const readFromFile = ( filePath ) => {
    return fs.readFileSync( filePath, 'utf8' );
};

/**
 * Transform raw String from file to array of customer details
 * @param {*} fileContent 
 * @return Array of customers
 */
const toJSON = ( fileContent ) => {
    // Break the string content into lines
    let lines = fileContent.split( NEWLINE_CHAR );
    // Remove empty rows from the array
    lines = lines.filter( line => line !== "" );
    // since the first row contains name of headers, we have to remove from csv data
    const headers = lines.shift().split(',');
    // create JSON objects 
    return lines.map( item => {
        const out = {};
        item = item.split(',');
        out[ headers[0] ] = item.shift(); // extract email
        out[ headers[2] ] = item.pop(); // extract schedule
        out[ headers[1] ] = item.join(',').replace(/"/g,''); // removing the extra quotes, eg ""abc"" => "abc"
        return out;
    });
    
};

const parse = ( filePath ) => {
    return toJSON( readFromFile( filePath ) );
};

module.exports = {
    readFromFile,
    toJSON,
    parse
};