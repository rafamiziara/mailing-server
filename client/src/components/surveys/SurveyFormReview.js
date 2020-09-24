import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';
import './SurveyFormReview.css';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      <div key={name}>
        <label className="form-label-r">{label}</label>
        <div id="form-input-r">
          {formValues[name]}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="form-box-r">
        <div className="confirm-title">Please confirm your entries</div>
        {reviewFields}
      </div>
      <img onClick={onCancel} className="back" src="/left-arrow-yellow.svg" />
      <img onClick={() => submitSurvey(formValues, history)} className="next" src="/right-arrow.svg" />
    </div>
  );
}

function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));