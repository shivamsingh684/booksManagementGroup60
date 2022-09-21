const mongoose = require('mongoose');

const isValid = function (value) {
    if(typeof value === 'undefined' || value === null) return false;
    if(typeof value === 'string' && value.trim().length == 0) return false;
    return true;
}

const isValidName = function (value) {
    let nameRegex = /^[a-zA-Z ]+$/;
    if (nameRegex.test(value)) return true;
  };

module.exports = {isValidName, isValid}