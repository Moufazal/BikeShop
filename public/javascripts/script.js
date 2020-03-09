// Set your publishable key: remember to change this to your live publishable key in production
var stripe = Stripe('pk_test_pujHVcpGuFyZNSE1gJyjtPau00Pvvk13HU');
console.log('sessionStripe ID', sessionStripeID);

document.getElementById('checkout').addEventListener("click", function(){
  stripe.redirectToCheckout({
      sessionId: sessionStripeID
    }).then(function (result) {

    });
})