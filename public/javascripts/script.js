const {publicKey} = require('../../config/config');

// Set your publishable key: remember to change this to your live publishable key in production
var stripe = Stripe(publicKey);
console.log('sessionStripe ID', sessionStripeID);

document.getElementById('checkout').addEventListener("click", function(){
  stripe.redirectToCheckout({
      sessionId: sessionStripeID
    }).then(function (result) {

    });
})