const assert = require('assert');
const CSVParser =  require('../src/csv-parser');
const path = require('path');
const DATA_FILEPATH = path.resolve(__dirname, "../data" , "customers.csv");

describe ('This component should Convert CSV to JSON', () => {
    let csvString = null;
    before(() => {
        csvString = CSVParser.readFromFile(DATA_FILEPATH);
    });
    
    it('Should read the CSV file, return a string value', ()=>{
        assert.equal(csvString.constructor.name, "String");
    });

    it('Should convert string to Array of well formatted JSONs`', () => {
        const dummyCSV = 'email,text,schedule\r\nsyed@tp.com,"Hello , good morning",0s-5s-6s';
        const expectedJSON = [{"email": "syed@tp.com", "text":"Hello , good morning", "schedule": "0s-5s-6s" }];
        assert.deepEqual(CSVParser.toJSON(dummyCSV), expectedJSON);
    });

});