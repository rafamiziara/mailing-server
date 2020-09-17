import React, { Component } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { connect } from 'react-redux';
import * as actions from '../actions';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

class Payments extends Component {
  async handleClick(event) {
    const stripe = await stripePromise;

    const res = await axios.post('/api/stripe');
    const session = await res.data;

    await stripe.redirectToCheckout({ sessionId: session.id });
  }

  render() {
    return (
      <button className="btn" role="link" onClick={this.handleClick}>
        Add Credits
      </button>
    );
  }
}

export default connect(null, actions)(Payments);