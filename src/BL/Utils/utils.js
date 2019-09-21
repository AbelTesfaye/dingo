const cheerio = require('cheerio');

function formatTwoDigits(n) {
	return n < 10 ? '0' + n : n;
}

/**
 * Format time to "HH:mm:ss" or "mm:ss"
 */
export const formatTime = seconds => {
	const ss = Math.floor(seconds) % 60;
	const mm = Math.floor(seconds / 60) % 60;
	const hh = Math.floor(seconds / 3600);

	if (hh > 0) {
		return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss);
	} else {
		return mm + ':' + formatTwoDigits(ss);
	}
};

fetchFromEndpoint = (endpoint, callback) => {
	const url = 'https://dingo-backend.now.sh/';

	console.log('fetching from url:' + `${url}${endpoint}`);
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
	const url = 'https://dingo-backend.now.sh/';

	fetch(`${url}${endpoint}`)
		.then(response => response.text())
		.then(response => {
			callback(response);
		})
		.catch(error => {
			console.error(error);
		});
};

fetchFromLastFmWithoutParsing = (endpoint, callback) => {
	const url = 'https://www.last.fm/';

	console.log('fetching from url:' + `${url}${endpoint}`);
	fetch(`${url}${endpoint}`)
	.then(response => response.text())
	.then(responseText => {
			callback(responseText);
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
			...item,
			id: index.toString(),
			title: item.name,
			artist: item.artistName,
			artwork: item.images ? item.images[item.images.length - 1] : item.albumart ? item.albumart : '',
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
			artwork: item.image[item.image.length - 1]['#text'],
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
				return item['#text'];
			}),
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
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};



const getTopTracks = (html) => {
    const $ = cheerio.load(html);

    const topTracksList = []
    $('table.globalchart').first()
      .find('tr.globalchart-item').each(function(i, elem) {
        // this === el
        const title = $(this).find(".globalchart-name").text().trim()
        const artist = $(this).find(".globalchart-track-artist-name").text().trim()
        const thumbnail= $(this).find(".globalchart-image").find("img").first().attr("src")
        const videoId= $(this).find("a").attr("data-youtube-id")
    
        const currentTrackObj = {name:title,artistName:artist,
                                images:[thumbnail], videoId}
        
        topTracksList.push(currentTrackObj);
      });

      return topTracksList;
    
}


const getArtists = (html) => {
    const $ = cheerio.load(html);
    const artistsResultList = []
    
     $("ul.artist-results").find("li").each(function(i,elem){
        // this === el
        const thumbnail = $(this).find(".artist-result-image").find('img').attr('src')
        const artist = $(this).find("h4.artist-result-heading").text().trim()
        const listenerCount = $(this).find("p.artist-result-listeners").
                                clone().children().remove().end().text().trim() // avoids the "listeners" part of the text
    
        const artistResult = {images:[thumbnail],name:[artist],listenerCount}
        artistsResultList.push(artistResult)
    });
    
    return artistsResultList;
}

const getTracks = (html) => {
    const $ = cheerio.load(html);
    const trackResultList = []

    $('tbody').first().find("tr").each(function(i,elem){
        // this === elem
        const videoId = $(this).find('td.chartlist-play').find('a').attr('data-youtube-id')
        const thumbnail = $(this).find('td.chartlist-image').find('img').attr('src')
        const title = $(this).find('td.chartlist-name').text().trim()
        const artist = $(this).find('td.chartlist-artist').text().trim()
        const duration = $(this).find('td.chartlist-duration').text().trim()

        const trackResult = {videoId,images:[thumbnail],name:title,artistName:artist,duration}
        trackResultList.push(trackResult)
    });

    return trackResultList;

}

const utils = {
	fetchFromEndpoint,
	fetchFromEndpointWithoutParsing,
	addPropertiesToObjectsInArray,
	convertToTrackPlayerFormat,
	convertToTrackPlayerFormatFromGeneratedPlaylist,
	convertAlbumFromTagResultToAppFormat,
	getIndexOfTrackUsingId,
	getUnique,
	padText,
	fetchFromLastFmWithoutParsing,
	getTopTracks,
	getArtists,
	getTracks,
};
export default utils;
