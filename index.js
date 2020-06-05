const Alexa = require('ask-sdk');
const { TimestampVerifier } = require('ask-sdk-express-adapter');

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

const skillBuilder = Alexa.SkillBuilders.custom()
.addRequestHandlers(ExchangeRateIntent,
  MovieIntent,
  BikeIntent,
  TrainIntent,
  TramIntent)
.addErrorHandler(ErrorHandler)

// AWS Lambda
exports.alexaSkill = skillBuilder.lambda();

const skill = skillBuilder.create();

/**
 * Google Cloud Function
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.gcloudSkill = async (req, res) => {
  try {
    const textBody = JSON.stringify(req.body);
    await new TimestampVerifier().verify(textBody);
  } catch (err) {
    // server return err message
    console.log(err)
    res.status(400).send('Bad Request')
    return
  }

  const response = await skill.invoke(req.body)
  res.send(response);
}
