import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { secrets } from '@config/secrets';
import { User } from '@entities/User';
import { requireCredits } from './middlewares/requireCredits';
import { requireLogin } from './middlewares/requireLogin';

import { createSurveyController } from './useCases/createSurvey';
import { listSurveysController } from './useCases/listSurveys';
import { getFeedbackController } from './useCases/getFeedback';
import { createChargeController } from './useCases/createCharge';
import { deleteSurveyController } from './useCases/deleteSurvey';
import { addCreditsController } from './useCases/addCredits';

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  const { id } = req.user as User;
  const accessToken = jwt.sign({ id }, secrets.jwtKey);

  res.cookie('accessToken', accessToken);
  res.redirect(`${secrets.redirectDomain}/surveys`);
});

router.get('/api/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.redirect(`${secrets.redirectDomain}/`);
});

router.get('/api/current_user', (req, res) => {
  res.send(req.currentUser);
});

router.post('/api/stripe', requireLogin, createChargeController.handle);

router.get('/api/stripe/success', requireLogin, addCreditsController.handle);

router.get('/api/surveys/:surveyId/:choice', (req, res) => {
  res.redirect('/thanks');
});

router.get('/api/surveys', requireLogin, listSurveysController.handle);

router.delete('/api/surveys/:surveyId', requireLogin, deleteSurveyController.handle);

router.post('/api/surveys/webhooks', getFeedbackController.handle);

router.post('/api/surveys', requireLogin, requireCredits, createSurveyController.handle);

export { router };
