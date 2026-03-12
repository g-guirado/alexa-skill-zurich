import * as Alexa from 'ask-sdk-core';
import { TimestampVerifier } from 'ask-sdk-express-adapter';
import { RequestHandler, ErrorHandler, HandlerInput } from 'ask-sdk-core';
import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import * as transportation from './transportation';
import * as money from './money';
import * as movies from './movie';

interface GCloudRequest {
  body: RequestEnvelope;
}

interface SendableResponse {
  send(body: string): void;
}

interface GCloudResponse {
  status(code: number): SendableResponse;
  send(body: ResponseEnvelope): void;
}

const ExchangeRateIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExchangeRateIntent';
  },
  async handle(handlerInput: HandlerInput) {
    const text = await money.getExchangeRates();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
};

const MovieIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MovieIntent';
  },
  async handle(handlerInput: HandlerInput) {
    const text = await movies.getMovies();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text ?? '')
      .getResponse();
  }
};

const BikeIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BikeIntent';
  },
  async handle(handlerInput: HandlerInput) {
    const text = await transportation.checkAvailableBikes();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
};

const TrainIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TrainIntent';
  },
  async handle(handlerInput: HandlerInput) {
    const text = await transportation.getNextTrains();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
};

const TramIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TramIntent';
  },
  async handle(handlerInput: HandlerInput) {
    const text = await transportation.getNextTrams();
    console.log(text);
    return handlerInput.responseBuilder
      .speak(text)
      .getResponse();
  }
};

const ErrorHandlerImpl: ErrorHandler = {
  canHandle(): boolean {
    return true;
  },
  handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak('Bug - this intent is unhandled.')
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    ExchangeRateIntent,
    MovieIntent,
    BikeIntent,
    TrainIntent,
    TramIntent
  )
  .addErrorHandlers(ErrorHandlerImpl);

// AWS Lambda
export const alexaSkill = skillBuilder.lambda();

const skill = skillBuilder.create();

/**
 * Google Cloud Function
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {GCloudRequest} req Cloud Function request context.
 * @param {GCloudResponse} res Cloud Function response context.
 */
export const gcloudSkill = async (req: GCloudRequest, res: GCloudResponse): Promise<void> => {
  try {
    const textBody = JSON.stringify(req.body);
    await new TimestampVerifier().verify(textBody);
  } catch (err) {
    // server return err message
    console.log(err);
    res.status(400).send('Bad Request');
    return;
  }

  const response = await skill.invoke(req.body);
  res.send(response);
};
