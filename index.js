const Alexa = require('ask-sdk');
const transportation = require('./transportation');
const money = require('./money');
const movies = require('./movie');

const ExchangeRateIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExchangeRateIntent';
  },
  async handle(handlerInput) {
    const text = await money.getExchangeRates();
    console.log(text);
      return handlerInput.responseBuilder
      .speak(text);
  }
}

const MovieIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MovieIntent';
  },
  async handle(handlerInput) {
    const text = await movies.getMovies();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
}

const BikeIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BikeIntent';
  },
  async handle(handlerInput) {
    const text = await transportation.checkAvailableBikes();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
}

const TrainIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TrainIntent';
  },
  async handle(handlerInput) {
    const text = await transportation.getNextTrains();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
}

const TramIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TramIntent';
  },
  async handle(handlerInput) {
    const text = await transportation.getNextTrams();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
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
