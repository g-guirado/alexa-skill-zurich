import axios from 'axios';
import _ from 'lodash';
import dateFormat from 'dateformat';

interface MovieDetails {
  movie: boolean;
  cinemas: string[];
}

interface TodayMovies {
  [movieName: string]: MovieDetails;
}

interface MoviesApiResponse {
  [date: string]: TodayMovies;
}

export async function getMovies(): Promise<string | undefined> {
  const now = new Date();
  const date = dateFormat(now, 'yyyymmdd');

  const url = `https://www.kitag.com/api/movies/?number_days=1&start=${date}`;

  console.log(`Fetching ${url}`);

  try {
    const res = await axios.get<MoviesApiResponse>(url);
    console.log(res.data);
    const todayMovies = res.data[date];
    const matchingMovies: string[] = [];
    for (const movieName in todayMovies) {
      const movieDetails = todayMovies[movieName];

      if (movieDetails.movie && _.includes(movieDetails.cinemas, 'abaton')) { // Interested in movies at Abaton only
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
  } catch (e) {
    console.log('Got an exception :-(');
    console.log(e);
    if (axios.isAxiosError(e)) {
      console.log(e.response);
    }
  }
}
