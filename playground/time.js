// UNIX Jan 1.st 1970 00:00:00 am = 0
// store in miliseconds; 1000 = 1sec

const moment = require('moment');

// var date = new Date();
// var month = ['Jan', 'Feb']
// console.log(date.getMonth()); // zero based month 0-11

// var date = moment();
// date.add(1, 'y').subtract(9, 'M');
// console.log(date.format('MMM Do, YYYY'));
// console.log(date.format('h:mm a'));


var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
console.log(date);
