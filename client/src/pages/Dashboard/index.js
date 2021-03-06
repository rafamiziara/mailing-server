import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AddButton, AddWrapper } from './styles';
import { fetchSurveys } from '../../actions';
import SurveyList from './SurveyList';
import SimpleModal from '../../components/Modal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderButton() {
    if(!this.props.auth) {
      return
    }

    if(this.props.auth.credits < 1) {
      return (
        <SimpleModal text="You need to add credits in order to create a survey" />
      );
    }

    if(this.props.surveys.length > 5) {
      return (
        <SimpleModal text="As a test project, you have a limit of 5 surveys. Delete some survey to continue" />
      );
    }

    return (
      <Link to={"/surveys/new"}>  
        <AddButton src="/add.svg" />
      </Link>
    );
  }

  render() {
    return (
      <div>
        <Header />
        <SurveyList />
        <AddWrapper>
          {this.renderButton()}
        </AddWrapper>
        <Footer />
      </div>
    );
  }
};

const mapStateToProps = ({ auth, surveys }) => {
  return { auth, surveys }
};

export default connect(mapStateToProps, { fetchSurveys })(Dashboard);