// don't touch this
output = document.getElementById('output');

// logging function
function log() {
  try {
    console.log.apply(console, arguments);
  }
  catch(e) {
    try {
      opera.postError.apply(opera, arguments);
    }
    catch(e){
      alert(Array.prototype.join.call( arguments, " "));
    }
  }
}

// check if integer (excludes strings)
function isIntNotString(x) {
  return (typeof x === 'number' && (x % 1) === 0);
}

// check if integer (includes strings)
function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

// return random integer
function randomInt(max)
{
    return Math.floor(Math.random()*(max+1));
}

function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// toggle = returns boolean opposite
function toggle(value) {
  return (value ? !value : !value);
}

function formatAsMoney(x) {
  return parseFloat(x).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function reverseString(string) {
  return string.split('').reverse().join('');
}

