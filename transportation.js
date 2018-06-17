const axios = require('axios');
const _ = require('lodash');



function getNextPublicTransportation(departureStation, arrivalStation, timeBufferInMin, transitName) {
  return axios(`http://transport.opendata.ch/v1/connections?from=${departureStation}&to=${arrivalStation}&direct=1&fields[]=connections/from/departure&fields[]=connections/from/platform&limit=10`)
  .then(opendataResults => {
    console.log(`Number of fetched connections: ${opendataResults.data.connections.length}`);
    const nextReachableTrains = _.filter(opendataResults.data.connections, t => {
      const departure = new Date(t.from.departure);
      const whenICanBeThere = new Date();
      whenICanBeThere.setMinutes(whenICanBeThere.getMinutes() + timeBufferInMin); // Give me some time to reach the station

      return departure.getTime() >= whenICanBeThere.getTime();
    } );

    const firstReachableTrains = _.slice(nextReachableTrains, 0, 3); // only keep the next 3 reachable trains
    console.log(`Number of reachable connections: ${nextReachableTrains.length}`);

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
  getNextTrains,
  getNextTrams
}
