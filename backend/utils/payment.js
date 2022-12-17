const axios = require('axios');

class Payment {
  constructor() {
    this.bepaid = axios.create({
      auth: {
        username: process.env.BEPAID_ID,
        password: process.env.BEPAID_SECRET_KEY
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': 2
      },
      baseURL: 'https://checkout.bepaid.by/ctp/api/checkouts'
    });
  }

  async getTokenAndUrl(amount, firstName, surname, email) {
    const data = {
      'checkout': {
        'test': true,
        'transaction_type': 'payment',
        'attempts': 3,
        'settings': {
          'return_url': process.env.FRONTEND_URL,
          'button_text': 'Pay',
          'button_next_text': 'Return',
          'language': 'en',
          'credit_card_fields': {
            'holder': firstName + ' ' + surname,
            'read_only': ['holder']
          }
        },
        'payment_method': {
          'types': ['credit_card']
        },
        'order': {
          'currency': 'USD',
          'amount': amount,
          'description': 'Transaction for increacing balance'
        }
      }
    }
    const res = await this.bepaid.post('/', data)
      .catch(error => console.log(error));
    if (!res?.data?.checkout) {
      return;
    }
    else {
      return res.data.checkout;
    }
  } 

  async check(token) {
    const { data } = await this.bepaid.get(token);
    return data?.checkout?.status;
  }

  async withdraw(token, amount) { 
    const data = {
      'request': {
        'test': true,
        'amount': amount,
        'currency': 'USD',
        'description': 'Test transaction',
        'tracking_id': 'tracking_id_000',
        'language':'en',
        'credit_card': {
          'token': token
        }
      }
    }
    const res = await axios.post('https://gateway.bepaid.by/transactions/credits', data, {
      auth: {
        username: process.env.BEPAID_ID,
        password: process.env.BEPAID_SECRET_KEY
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': 2
      }
    }).catch(error => console.log(error));
    return res?.data?.transaction?.status;
  }
}

module.exports = new Payment();
