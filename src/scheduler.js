const request = require('axios');
const CSVParser =  require('./csv-parser');
const path = require('path');
const DATA_FILEPATH = path.resolve(__dirname, "../data" , "customers.csv");
const CUSTOMER_COMM_SERVICE_URL = 'http://localhost:9090/messages';

/**
 * Utilises axios libray to make a POST request
 * @param {*} customer 
 * @returns Promise
 */

const makeRequest = ( customer ) => {
    return request.post( CUSTOMER_COMM_SERVICE_URL, customer ).then( res => res.data );
};

/**
 * Transform the schedule attribute in the JSONs to make them suitable for comparison
 * @param {*} customers 
 * @returns customers with one additional attribute in all of them (readableSchedule)
 */
const prepareJSON = ( customers ) => {
  return customers.map( customer => {
    //eg: "0s-5s", Removes the 's' and splits the string into array of numbers as string 
    customer['readableSchedule'] = customer.schedule.replace(/s/g,'').split('-'); 
    // Convert array of strings into numbers, to help conditioning later
    customer.readableSchedule = customer.readableSchedule.map( schedule => parseInt(schedule) ) 
    return customer;
  });
};

/**
 * 
 * @param Number timer 
 * @param {*} customers 
 * @param Number timerId 
 */
const sendReminders = ( timer, customers , timerId ) => {
  customers.forEach( customer => {
    if( customer.readableSchedule.indexOf( timer ) > -1 && !customer.paid ){
      return makeRequest( customer )
        .then( data=> { 
          console.log(`Reminder sent to: ${data.email} , paid: ${data.paid}`);
          if(data.paid){
            customer.paid = true;
          }
        })
        .catch( err => {
          clearInterval( timerId );
          console.error( err.message, "\nPlease make sure that Commserice is running" );
        })
    }
  })
};

/**
 * Bootstrap the application, also start timer
 */

const init = () => {
    let timer = 0;
    const customerData = prepareJSON ( CSVParser.parse( DATA_FILEPATH ));

    const timerId = setInterval( () => {
      if( timer > 20 ) return clearInterval( timerId );
      sendReminders( timer , customerData , timerId );
      timer++;
    }, 1000 );
};


module.exports = {
    makeRequest,
    prepareJSON,
    sendReminders,
    init
};