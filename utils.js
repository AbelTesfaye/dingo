function formatTwoDigits(n) {
  return n < 10 ? "0" + n : n;
}

/**
 * Format time to "HH:mm:ss" or "mm:ss"
 */
export const formatTime = seconds => {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ":" + formatTwoDigits(mm) + ":" + formatTwoDigits(ss);
  } else {
    return mm + ":" + formatTwoDigits(ss);
  }
};

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

addPropertiesToObjectsInArray = (array, propertiesToAdd) => {
  newArray = [];
  array.map(item => {
    newArray.push({ ...item, ...propertiesToAdd });
  });
  return newArray;
};

convertToTrackPlayerFormat = tracks => {
  newTracks = [];
  tracks.map((item, index) => {
    newTracks.push({
      id: index.toString(),
      title: item.name,
      artist: item.artistName,
      artwork: item.images
        ? item.images[item.images.length - 1]
        : item.albumart
        ? item.albumart
        : ""
    });
  });
  return newTracks;
};

convertToTrackPlayerFormatFromGeneratedPlaylist = tracks => {
  newTracks = [];
  tracks.map((item, index) => {
    newTracks.push({
      id: index.toString(),
      title: item.name,
      artist: item.artist.name,
      artwork: item.image[item.image.length - 1]["#text"]
    });
  });
  return newTracks;
};

convertAlbumFromTagResultToAppFormat = albums => {
  newTracks = [];
  albums.map((item, index) => {
    newTracks.push({
      id: index.toString(),
      name: item.name,
      artistName: item.artist.name,
      images: item.image.map(item => {
        return item["#text"];
      })
    });
  });
  return newTracks;
};

getIndexOfTrackUsingId = (tracks, trackId) => {
  let foundIndex = -1;
  tracks.map((item, index) => {
    if (item.id === trackId) foundIndex = index;
  });
  return foundIndex;
};

getUnique = (arr, comp) => {
  const unique = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};
padText = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const utils = {
  fetchFromEndpoint,
  fetchFromEndpointWithoutParsing,
  addPropertiesToObjectsInArray,
  convertToTrackPlayerFormat,
  convertToTrackPlayerFormatFromGeneratedPlaylist,
  convertAlbumFromTagResultToAppFormat,
  getIndexOfTrackUsingId,
  getUnique,
  padText
};
export default utils;
