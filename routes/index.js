var express = require('express');
var router = express.Router();
// import secret key
const {secretKey} = require('../config/config');

  // Set your secret key: remember to change this by your live secret key in production
  const stripe = require('stripe')(secretKey);


/* Array with all bike informations to display on the home page */
var dataBike = [
  {vImg: "bike-1.jpg", vModel: "BIKO45", vPrix: 679},
  {vImg: "bike-2.jpg", vModel: "ZOOK7", vPrix: 799},
  {vImg: "bike-3.jpg", vModel: "LIKO89", vPrix: 839},
  {vImg: "bike-4.jpg", vModel: "GEWO", vPrix: 1206},
  {vImg: "bike-5.jpg", vModel: "TITAN5", vPrix: 989},
  {vImg: "bike-6.jpg", vModel: "AMIG39", vPrix: 599},
]




/* GET home page. */
router.get('/', function(req, res, next) {
    // req.session.dataBikeShop : contain all bike informations per user in the shop page to purchase
  if (!req.session.dataBikeShop){
    req.session.dataBikeShop = [];
  }
  if (!req.session.stripeCard){
    req.session.stripeCard = [];
  }
  res.render('index', {dataBike});
});

/* GET Shop page. */
router.get('/shop', async function(req, res, next) {
  if (!req.session.dataBikeShop){
    req.session.dataBikeShop = [];
  }
  if (!req.session.stripeCard){
    req.session.stripeCard = [];
  }
    // STRIPE
    // Delete datas on session stripeCard in order to add them by dataBikeShop
    if(req.session.dataBikeShop.length > 0){
      req.session.stripeCard.splice(0);
      for (var i = 0; i < req.session.dataBikeShop.length; i++){
        req.session.stripeCard.push({
          name: req.session.dataBikeShop[i].vModel,
          amount: req.session.dataBikeShop[i].vPrix * 100,
          currency: 'eur',
          quantity: req.session.dataBikeShop[i].vQtity,
        })
      };
    }

  // Session Stripe
  if (req.session.stripeCard.length > 0){
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.session.stripeCard,
      success_url: 'http://127.0.0.1:3000/success',
      cancel_url: 'http://127.0.0.1:3000/',
    });
    // Recover the id sent by Stripe when the session was created
    var sessionStripeID = session.id;
  };

  res.render('shop', {dataBikeShop: req.session.dataBikeShop, sessionStripeID});
});

/* POST Receive bought bike informations from frontend. */
router.post('/shop', async function(req, res, next) {
  req.session.dataBikeShop.push({vImg: req.body.bike_img, vModel: req.body.bike_model, vPrix: req.body.bike_prix, vQtity: req.body.bike_qtity});

  // STRIPE
  req.session.stripeCard.splice(0);
  for (var i = 0; i < req.session.dataBikeShop.length; i++){
    req.session.stripeCard.push({
      name: req.session.dataBikeShop[i].vModel,
      amount: req.session.dataBikeShop[i].vPrix * 100,
      currency: 'eur',
      quantity: req.session.dataBikeShop[i].vQtity,
    })
  };

  // Session Stripe
  if (req.session.stripeCard.length > 0){
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.session.stripeCard,
      success_url: 'http://127.0.0.1:3000/success',
      cancel_url: 'http://127.0.0.1:3000/',
    });
    var sessionStripeID = session.id;
  };
  res.render('shop', {dataBikeShop: req.session.dataBikeShop, sessionStripeID});
});


/* GET  Delete bike with it's position. */
router.get('/delete_bike', async function(req, res, next) {
  req.session.dataBikeShop.splice(req.query.position, 1);
    // STRIPE
      req.session.stripeCard.splice(0);
      for (var i = 0; i < req.session.dataBikeShop.length; i++){
        req.session.stripeCard.push({
          name: req.session.dataBikeShop[i].vModel,
          amount: req.session.dataBikeShop[i].vPrix * 100,
          currency: 'eur',
          quantity: req.session.dataBikeShop[i].vQtity,
        })
      };

    // Session Stripe
    if (req.session.stripeCard.length > 0){
      var session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.session.stripeCard,
        success_url: 'http://127.0.0.1:3000/success',
        cancel_url: 'http://127.0.0.1:3000/',
      });
      var sessionStripeID = session.id;
    };
  res.render('shop', {dataBikeShop: req.session.dataBikeShop, sessionStripeID});
});


/* POST update bike quantity with it's position */
router.post('/update-shop', async function(req, res, next) {
  req.session.dataBikeShop[req.body.position].vQtity= req.body.bikeQuantity;
  // STRIPE
  req.session.stripeCard.splice(0);
  for (var i = 0; i < req.session.dataBikeShop.length; i++){
    req.session.stripeCard.push({
      name: req.session.dataBikeShop[i].vModel,
      amount: req.session.dataBikeShop[i].vPrix * 100,
      currency: 'eur',
      quantity: req.session.dataBikeShop[i].vQtity,
    })
  };

  // Session Stripe
  if (req.session.stripeCard.length > 0){
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.session.stripeCard,
      success_url: 'http://127.0.0.1:3000/success',
      cancel_url: 'http://127.0.0.1:3000/',
    });
    var sessionStripeID = session.id;
  };
  res.render('shop', {dataBikeShop: req.session.dataBikeShop, sessionStripeID});
});


/* GET Confirm page (success after stripe payment). */
router.get('/success', function(req, res, next) {
  res.render('confirm',{});
});



module.exports = router;
