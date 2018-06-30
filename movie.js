const axios = require('axios');
const _ = require('lodash');
const dateFormat = require('dateformat');

function getMovies() {
  const now = new Date();
  const date = dateFormat(now, "yyyymmdd");

  const url = `https://www.kitag.com/api/movies/?number_days=1&start=${date}`;

  console.log(`Fetching ${url}`);

  return axios(url).then(res => {
    console.log(res.data)
    const todayMovies = res.data[date];
    const matchingMovies = [];
    for (movieName in todayMovies) {
      console.log(`Processing movie ${movieName}`);
      const movieDetails = todayMovies[movieName];

      if (movieDetails.movie && _.includes(movieDetails.cinemas, 'abaton')) { // Interested in movies at Abaton only
        console.log(`Matching movie: ${movieName}`)
        matchingMovies.push(movieName);
      }
    }

    let fullText = '';
    _.forEach(matchingMovies, m => {
      // TODO: more checks?
      // Remove CH-DE?
      // Add times?

      fullText += `${m}; `;
    });
    return `Found ${matchingMovies.length} movies at Abaton: ${fullText}`;
  }).catch(e => {
    console.log('Got an exception :-(');
    console.log(e);
    console.log(e.response);
  });
}

module.exports = {
  getMovies
}
