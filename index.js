const Alexa = require('alexa-sdk');
const transportation = require('./transportation');

const handlers = {
  'BikeIntent': function () {
    return transportation.checkAvailableBikes().then(text =>  {
      console.log(text);
      this.emit(':tell', text);
    });
  },

  'TrainIntent': function () {
    return transportation.getNextTrains().then(text =>  {
      console.log(text);
      this.emit(':tell', text);
    });
  },

  'TramIntent': function () {
    return transportation.getNextTrams().then(text =>  {
      console.log(text);
      this.emit(':tell', text);
    });
  },

  'Unhandled': function () {
    this.emit(':tell', 'Bug - this intent is unhandled.');
  }
};

/**
 * Google Cloud Function
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.alexaSkill = (req, res) => {
  console.log(req);

  const context = {
    fail: () => {
      // Simply fail with internal server error
      res.sendStatus(500);
    },
    succeed: data => {
      console.log(data)
      res.send(data);
    }
  };

  // Initialize alexa sdk
  const alexa = Alexa.handler(req.body, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
