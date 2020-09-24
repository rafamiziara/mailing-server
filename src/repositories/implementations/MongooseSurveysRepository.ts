import { Schema, model, Document } from 'mongoose';
import { ISurveysRepository } from '../ISurveysRepository';
import { Survey as SurveyAttrs } from '../../entities/Survey';

interface SurveyDoc extends Document, SurveyAttrs {
  id: string;
}

const surveySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    totalRecipients: {
      type: Number,
      required: true,
    },
    recipients: [{
      email: {
        type: String,
        required: true,
      },
      responded: {
        type: Boolean,
        default: false,
      },
    }],
    yes: {
      type: Number,
      default: 0,
    },
    no: {
      type: Number,
      default: 0,
    },
    _user: {
      type: String,
      required: true,
    },
    dateSent: {
      type: Number,
      required: true,
    },
    lastResponded: Date,
  }, {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Survey = model<SurveyDoc>('Survey', surveySchema);

class MongooseSurveysRepository implements ISurveysRepository {
  async save(surveyAttrs: SurveyAttrs): Promise<SurveyDoc> {
    const survey = new Survey(surveyAttrs);
    await survey.save();
    return survey;
  }

  async getSurveysByUserId(userId: string): Promise<SurveyDoc[]> {
    const surveys = await Survey.find({ _user: userId }).select({ recipients: false });
    return surveys;
  }

  async getSurveyById(surveyId: string): Promise<SurveyDoc> {
    const survey = await Survey.findOne({ id: surveyId });
    return survey;
  }

  async updateFeedback(
    surveyId: string,
    recipientMail: string,
    choice: string,
  ): Promise<SurveyDoc> {
    const survey = await Survey.updateOne({
      id: surveyId,
      recipients: {
        $elemMatch: { email: recipientMail, responded: false },
      },
    }, {
      $inc: { [choice]: 1 },
      $set: { 'recipients.$.responded': true },
      lastResponded: new Date(),
    });

    return survey;
  }

  async delete(surveyId: string): Promise<void> {
    await Survey.findOneAndRemove({ id: surveyId });
  }
}

export const mongooseSurveysRepository = new MongooseSurveysRepository();
