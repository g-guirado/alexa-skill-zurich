const Alexa = require('ask-sdk');
const transportation = require('./transportation');
const money = require('./money');
const movies = require('./movie');

const ExchangeRateIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExchangeRateIntent';
  },
  handle(handlerInput) {
    return money.getExchangeRates().then(text => {
      console.log(text);
      return handlerInput.responseBuilder
      .speak(text);
    })
  }
}

const MovieIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MovieIntent';
  },
  handle(handlerInput) {
    return movies.getMovies().then(text => {
      console.log(text);
      return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
    })
  }
}

const BikeIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BikeIntent';
  },
  handle(handlerInput) {
    return transportation.checkAvailableBikes().then(text =>  {
      console.log(text);
      return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
    })
  }
}

const TrainIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TrainIntent';
  },
  handle(handlerInput) {
    return transportation.getNextTrains().then(text =>  {
      console.log(text);
      return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
    })
  }
}

const TramIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TramIntent';
  },
  handle(handlerInput) {
    return transportation.getNextTrams().then(text =>  {
      console.log(text);
      return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
    })
  }
}

const ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {
      return handlerInput.responseBuilder
          .speak('Bug - this intent is unhandled.')
          .getResponse();
  }
};

/**
 * Google Cloud Function
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.alexaSkill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(ExchangeRateIntent,
      MovieIntent,
      BikeIntent,
      TrainIntent,
      TramIntent)
    .addErrorHandler(ErrorHandler)
    .lambda();
