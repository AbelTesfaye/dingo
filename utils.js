import shortid from "shortid";


function formatTwoDigits(n) {
  return n < 10 ? "0" + n : n;
}

/**
 * Format time to "HH:mm:ss" or "mm:ss"
 */
export const formatTime=(seconds)=> {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ":" + formatTwoDigits(mm) + ":" + formatTwoDigits(ss);
  } else {
    return mm + ":" + formatTwoDigits(ss);
  }
}

fetchFromEndpoint = (endpoint, callback) => {
  const url = "https://dingo-backend.now.sh/";

  console.log("fetching from url:" + `${url}${endpoint}`);
  fetch(`${url}${endpoint}`)
    .then(response => response.json())
    .then(responseJson => {
      callback(responseJson);
    })
    .catch(error => {
      console.error(error);
    });
};
fetchFromEndpointWithoutParsing = (endpoint, callback) => {
  const url = "https://dingo-backend.now.sh/";

  fetch(`${url}${endpoint}`)
    .then(response => response.text())
    .then(response => {
      callback(response);
    })
    .catch(error => {
      console.error(error);
    });
};
insertKeyToArrayItems = array => {
  newArray = [];
  array.map(item => {
    newArray.push({ ...item, key: shortid.generate() });
  });
  return newArray;
};

const utils = {
  fetchFromEndpoint,
  fetchFromEndpointWithoutParsing,
  insertKeyToArrayItems
};
export default utils;
