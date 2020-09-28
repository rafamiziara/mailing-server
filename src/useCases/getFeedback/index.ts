import { MongooseSurveysRepository } from 'src/repositories/implementations/MongooseSurveysRepository';
import { GetFeedbackController } from './GetFeedbackController';
import { GetFeedbackUseCase } from './GetFeedbackUseCase';

const mongooseSurveysRepository = new MongooseSurveysRepository();

const getFeedbackUseCase = new GetFeedbackUseCase(
  mongooseSurveysRepository,
);

const getFeedbackController = new GetFeedbackController(
  getFeedbackUseCase,
);

export { getFeedbackController };
