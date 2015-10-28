'use strict';

// toolkit of useful functions
const kit = {

  // check if integer (excludes strings)
  isIntNotString(x) {
    return (typeof x === 'number' && (x % 1) === 0);
  },

  // check if integer (includes strings)
  isInt(value) {
    return !isNaN(value) && 
    parseInt(Number(value)) == value && 
    !isNaN(parseInt(value, 10));
  },

  // return random integer
  randomInt(max) {
    return Math.floor(Math.random() * (max + 1));
  },

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  // toggle = returns boolean opposite
  toggle(value) {
    return (value ? !value : !value);
  },

  formatAsMoney(x) {
    return parseFloat(x).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  reverseString(string) {
    return string.split('').reverse().join('');
  },

};


