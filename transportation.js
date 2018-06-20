const axios = require('axios');
const _ = require('lodash');

function checkAvailableBikes() {
  const publibikeStation = '149';
  // The API is at https://api.publibike.ch/v1/public/stations/<station>
  // WARNING: Publibike forbids requests coming from the US; therefore the Cloud Functions cannot
  // reach it. A proxy must be used.
  const publibikeApi = `https://api.publibike.ch/v1/public/stations/${publibikeStation}/`;

  return axios(publibikeApi)
  .then(publibikeResults => {
    console.log(publibikeResults);
    const bikes = publibikeResults.data.vehicles;
    if (bikes === undefined || bikes.length === 0) {
      return 'There are no available bikes';
    }

    var nBikes = 0;
    var nEbikes = 0;
    _.forEach(bikes, b => {
      if (b.type.id === 1) {
        ++nBikes;
      }
      else if (b.type.id === 2) {
        ++nEbikes;
      }
    });
    if (nEbikes === 0) {
      return `There are only normal bikes waiting: ${nBikes} of them.`;
    }
    return `There are ${nEbikes} E-Bikes and ${nBikes} normal bikes waiting.`;
  })
  .catch(e => {
    console.log(e.response);
    return 'Publibike returned an error!';
  });
}

function getNextPublicTransportation(departureStation, arrivalStation, timeBufferInMin, transitName) {
  return axios(`http://transport.opendata.ch/v1/connections?from=${departureStation}&to=${arrivalStation}&direct=1&fields[]=connections/from/departure&fields[]=connections/from/platform&limit=10`)
  .then(opendataResults => {
    console.log(`Number of fetched connections: ${opendataResults.data.connections.length}`);

    // Find trains I can reach (i.e. check timeBufferInMin)
    const nextReachableTrains = _.filter(opendataResults.data.connections, t => {
      const departure = new Date(t.from.departure);
      const whenICanBeThere = new Date();
      whenICanBeThere.setMinutes(whenICanBeThere.getMinutes() + timeBufferInMin);

      return departure.getTime() >= whenICanBeThere.getTime();
    } );

    const firstReachableTrains = _.slice(nextReachableTrains, 0, 3); // only keep the next 3 reachable trains
    console.log(`Number of reachable connections: ${nextReachableTrains.length}`);

    // For every train left, compute left time and create corresponding text for Alexa
    var text = `Next ${transitName}: `;
    _.forEach(firstReachableTrains, t => {
      const diffMs = new Date(t.from.departure).getTime() - new Date().getTime();
      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

      if (t.from.platform) {
        text += `in ${diffMins} minutes from platform ${t.from.platform}, `;
      }
      else {
        text += `in ${diffMins} minutes, `;
      }
    });

    return text;
  });
} 

function getNextTrains() {
  const departureStation = 8503001; // Zurich Altstetten
  const arrivalStation = 8503000; // Zurich HB
  return getNextPublicTransportation(departureStation, arrivalStation, 6, 'trains');
}

function getNextTrams() {
  const departureStation = 8591057; // Zurich Altstetten Bhf Nord
  const arrivalStation = 8594239; // Zurich Schiffbau
  return getNextPublicTransportation(departureStation, arrivalStation, 3, 'trams');
}

module.exports = {
  checkAvailableBikes,
  getNextTrains,
  getNextTrams
}
