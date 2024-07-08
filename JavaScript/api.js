'use strict';


const api_key = '7e1a313fd93c16e937bd6e695fb3c17a'

const imageBaseURL = 'https://image.tmdb.org/t/p/';


/**
 * fetch data from a server using the 'url'
 * and passes the result in JSON data to a cALLBACK function ,
 * along with an optional parameter if has 'OptionalParam
 */

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
  .then(response => response.json())
  .then(data => callback(data, optionalParam));
}


export { imageBaseURL, api_key, fetchDataFromServer };