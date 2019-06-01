module.exports = router =>{

  const database = require ('../database'),
        matching = require('../algs/matching.js');

  //request to make a cross promotion
  router.post('/cross_promote', (req, res)=>{
    //if the user does not have a session
    if (!req.session.key){
      console.log('No logged in user tried to cross promote');
      req.status(404).end();
    }
    //if the post request has no content
    if (!req.body){
      console.log('Cross promote had no body');
      req.status(401).end();
    }
    else{
      //get content of body
      var {promoterName, posterName} =req.body;
      database.connect(db=>{
        //get the promoter from the db
        db.db('users').collection('users').findOne({'username':promoterName}, (err, promoter)=>{
          if (err){
            console.log('THere was an error finding the promoter user: ' + promoterName);
            res.status(500).end();
            db.close();
          }
          //success case
          else{
            console.log('Promoter User: ' + promoterName + ' is ' + JSON.stringify(promoter));
            //get the poster's of the promotions profile
            db.db('users').collection('users').findOne({'username':posterName}, (err2, poster)=>{
              if (err2){
                console.log('THere was an error finding the poster user: ' + posterName);
                res.status(500).end();
                db.close();
              }
              else{
                //if the promoter has the contact
                var posterKnowsPromoter = false;
                for (var contact in poster.contacts){
                  if (poster.contacts[contact]['name']==promoterName){
                    posterKnowsPromoter=true;
                  }
                }

                //make post to social
                if(posterKnowsPromoter){
                  //get promotion from poster

                  //ed code, post this promotion to posters selected socials
                }
                //if the promoter is not in the list, do not make the post
                else{
                  console.log('Poster: '+posterName+' did not have: '+promoterName+' in their contacts list.');
                  res.status(200).send('Sorry, it appears this user does not have you in their contacts, so we will not post to their account. Try fidning them on your promotions page and adding them to your contacts.');
                  db.close();
                }
              }
            });
          }
        });
      }, dbErr=>{
        console.log('There was an error connecting to mongo: ' + dbErr);
        res.status(500).end();
      });
    }
  });

  //post request to add a mutual contact
  router.post('/add_mutual_contact', (req, res)=>{
    //if not session exists
    if (!req.session.key){
      console.log('No logged in user tried to cross promote');
      req.status(404).end();
    }

    //if no body exists
    if (!req.body){
      console.log('Cross promote had no body');
      req.status(401).end();
    }
    else{
      //store variables
      var {acceptorName, senderName} = req.body;
      database.connect(db=>{
        //get the acceptor's profile
        db.db('users').collection('users').findOne({'username':acceptorName}, (err, acceptor)=>{
          if (err){
            console.log("There was an error getting user: " + acceptorName + ' error: ' + err);
            res.status(500).end();
            db.close();
          }
          else{
            //get the senders profile
            db.db('users').collection('users').findOne({'username':senderName}, (err2, acceptor)=>{
              if (err2){
                console.log("There was an error getting user: " + senderName + ' error: ' + err2);
                res.status(500).end();
                db.close();
              }
              //success case
              else{
                var senderHasAcceptor = false;
                var acceptorHasSender = false;
                //check for contacts
                for (var con1 in acceptor.contacts){
                  if (acceptor.contacts[con1]['name']==senderName){
                    acceptorHasSender = true;
                  }
                }
                for (var con2 in sender.contacts){
                  if (acceptor.contacts[con2]['name']==acceptorName){
                    senderHasAcceptor = true;
                  }
                }
                //if the two know eachother already
                if (senderHasAcceptor && acceptorHasSender){
                  console.log('One of the two parties in add mutual contacts knows eachother.');
                  res.status(200).send('Sorry, it seems that you and ' +senderName+ ' already have eachother in your contacts');
                  db.close();
                }
                //add to acceptor's contacts if need be
                else if (senderHasAcceptor && (!acceptorHasSender)){
                  db.db('users').collection('users').updateOne({'username':acceptorName}, {$push:{'contacts':{'name':senderName, 'id':sender['_id']}}}, (err4, res4)=>{
                    if (err4){
                      console.log('There was an error adding '+senderName+' to ' +acceptorName+' error: ' + err4);
                      res.status(500).end();
                      db.close();
                    }
                    else{
                      console.log('Added: '+senderName+' to the contact list of ' +acceptorName);
                      res.status(200).send('We have exchanged your contact information. Check your contacts in the botton right corner to message or cross-promote with ' + senderName);
                      db.close();
                    }
                  });
                }
                //add to sender's contact if needed
                else if (acceptorHasSender && (!senderHasAcceptor)){
                  db.db('users').collection('users').updateOne({'username':senderName}, {$push:{'contacts':{'name':acceptorName, 'id':acceptor['_id']}}}, (err5, res5)=>{
                    if (err5){
                      console.log('There was an error adding '+acceptorName+' to ' +senderName+' contacts. Error: ' + err5);
                      res.status(500).end();
                      db.close();
                    }
                    else{
                      console.log('Added: '+acceptorName+' to the contact list of ' +senderName);
                      res.status(200).send('We have exchanged your contact information. '+senderName+' may reach out to you soon via our built in messaging feature. As always you message them. Just click "contacts" in the bottom right corner to begin cross-promotion with '+ senderName);
                      db.close();
                    }
                  });
                }
                //add to both personsons contacts
                else{
                  db.db('users').collection('users').updateOne({'username':senderName}, {$push:{'contacts':{'name':acceptorName, 'id':acceptor['_id']}}}, (err5, res5)=>{
                    if (err5){
                      console.log('There was an error adding '+acceptorName+' to ' +senderName+' contacts. Error: ' + err5);
                      res.status(500).end();
                      db.close();
                    }
                    else{
                      console.log('Added: '+acceptorName+' to the contact list of ' +senderName);
                      db.db('users').collection('users').updateOne({'username':acceptorName}, {$push:{'contacts':{'name':senderName, 'id':sender['_id']}}}, (err4, res4)=>{
                        if (err4){
                          console.log('There was an error adding '+senderName+' to ' +acceptorName+' error: ' + err4);
                          res.status(500).end();
                          db.close();
                        }
                        else{
                          console.log('Added: '+senderName+' to the contact list of ' +acceptorName);
                          res.status(200).send('We have exchanged your contact information. Check your contacts in the botton right corner to message or cross-promote with ' + senderName);
                          db.close();
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }, dbErr=>{
        console.log('There was an error connecting to mongo: ' + dbErr);
        res.status(500).end();
      });
    }
  });

router.post('/promotion', (req, res)=>{
  if (!req.session.key){
    console.log('No logged in user tried to cross promote');
    req.status(404).end();
  }
  if (!req.body){
    console.log('promotion had no body');
    req.status(401).end();
  }
  else{
    var {name, imgURL, caption, handles, location, mode, medias, preferences} = req.body;
    database.connect(db=>{
      db.db('promotions').collection('promotions').updateOne({'creator':req.session.key}, {$push:{'promotions':{'name':name, 'imgURL':imgURL, 'caption':caption, 'location':location, 'handles':handles, 'mode':mode, 'medias':medias, 'preferences':preferences}}}, (err2, res2)=>{
        if (err2){
          console.log('There was an error setting promotion: '+name+' for user: ' +req.session.key+' Error: ' + err2);
          res.status(500).end();
          db.close();
        }
        else{
          console.log('Set promotion ' +name+ ' for user: '+req.session.key);
          res.status(200).send('Congratulations, you have added this promotion to Banda! You can change what promotion you would like to use at anytime simply by changing the information here and clicking "Add". To begin running this promo simply go to you contacts and hit the promotion button. If they accept ')
        }
      });
    }, dbErr=>{
      console.log('There was an error connecting to mongo: ' + dbErr);
      res.status(500).end();
    });
  }
});

router.get('/search_promos', (req, res)=>{
  if (!req.session.key){
    console.log('No logged in user tried to cross promote');
    req.status(404).end();
  }
  if (!req.query){
    console.log('Cross promote had no body');
    req.status(401).end();
  }
  else{
    var {lat, lng, searchText, promoSearchingAs} = req.query;
    database.connect(db=>{
      matching.findCrossPromoters(req.session.key, promoSearchingAs, lat, lng, searchText, db, errCB=>{
        console.log('There was an error : ' + errCB);
        if (errCB=="Internal Server Error"){
          res.status(200).json({success:false, data:'Sorry, there was an error on our end. Please try searching again. If this error persits please notify us via our support tab on the Banda "b"'});
          db.close();
        }
        else{
          res.status(500).json({success:false, data:errCB});
          db.close();
        }
      }, okCB=>{
        console.log('Got in ok CB');
        res.status(200).json({success: true, data:okCB});
        db.close();
      });
    }, dbErr=>{
      console.log('There was an error connectiong to mongo: ' + dbErr);
      res.status(500).end();
    });
  }
});

router.post('/user_socials', (req, res)=>{
  if (!req.session.key){
    console.log('No logged in user tried to cross promote');
    req.status(404).end();
  }
  if (!req.body){
    console.log('promotion had no body');
    req.status(401).end();
  }
  else{
    var {id, mode, medias, imageURL, caption, handles, location} = req.body;
    database.connect(db=>{
      for (var key in medias){
        //post our thign to that media

      }
    }, errDB=>{
      console.log('There was an error connectiong to mongo: ' + errDB);
      res.status(500).end();
    });
  }
});

router.post('/add_pull', (req, res)=>{
  //this is the route that gets called from outside our site, such that our bands can quantify their clout.
  if (!req.body){
    console.log('request had no body');
    req.status(401).end();
  }
  else{
    var {id, mode} = req.body;
    database.connect(db=>{
      switch(mode){
        // adds 1 pull to a band, gig or user depending on what mode we recieved. That mode should be set in the route above
        case "bands":
        db.db('bands').collection('bands').updateOne({'_id':database.objectId(id)}, {$inc:{'pull':1}}, (err1, res1)=>{
          if (err1){
            console.log('There was an an error incrementing pull for band:: ' + err1);
            res.status(500).end();
            db.close();
          }
          else{
            console.log('Set promotion ' +name+ ' for user: '+req.session.key);
            res.redirect('/about');
            db.close();
          }
        });
        case "gigs":
        db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(id)}, {$inc:{'pull':1}}, (err1, res1)=>{
          if (err1){
            console.log('There was an an error incrementing pull for band:: ' + err1);
            res.status(500).end();
            db.close();
          }
          else{
            console.log('Set promotion ' +name+ ' for user: '+req.session.key);
            res.redirect('/about');
            db.close();
          }
        });
        break;
        default:
        console.log('On recognized mode in pull.' + mode);
        res.status(404).end();
        db.close();
        break;
        }
      }, dbErr=>{
        console.log('There was an error connecting to mongo: ' + dbErr);
        res.status(500).end();
      });
    }
  });

  //post request to search for a promo
  router.get('/search_promos', (req, res)=>{
    if (!req.session.key){
      console.log('No logged in user tried to cross promote');
      req.status(404).end();
    }
    if (!req.query){
      console.log('Cross promote had no body');
      req.status(401).end();
    }
    //success case
    else{
      var {lat, lng, searchText} = req.query;
      database.connect(db=>{
        //match the cross promoters
        matching.findCrossPromoters(req.session.key, lat, lng, searchText, db, errCB=>{
          console.log('There was an error : ' + errCB);
          if (errCB=="Internal Server Error"){
            res.status(200).json({success:false, data:'Sorry, there was an error on our end. Please try searching again. If this error persits please notify us via our support tab on the Banda "b"'});
            db.close();
          }
          else{
            //no matchs
            res.status(500).json({success:false, data:errCB});
            db.close();
          }
        }, okCB=>{
          //matchs found
          console.log('Got in ok CB');
          res.status(200).json({success: true, data:okCB});
          db.close();
        });
      }, dbErr=>{
        console.log('There was an error connectiong to mongo: ' + dbErr);
        res.status(500).end();
      });
    }
  });

  //post request for social media
  router.post('/user_socials', (req, res)=>{
    if (!req.session.key){
      console.log('No logged in user tried to cross promote');
      req.status(404).end();
    }
    if (!req.body){
      console.log('promotion had no body');
      req.status(401).end();
    }
    else{
      var {id, mode, medias, imageURL, caption, handles, location} = req.body;
      database.connect(db=>{
        //post reqiest for each media
        for (var key in medias){
          //post our thign to that media

        }
      }, errDB=>{
        console.log('There was an error connectiong to mongo: ' + errDB);
        res.status(500).end();
      });
    }
  });

  //meethod for admins to take inventory on db
  router.post('/add_pull', (req, res)=>{
    //this is the route that gets called from outside our site, such that our bands can quantify their clout.
    if (!req.body){
      console.log('request had no body');
      req.status(401).end();
    }
    else{
      var {id, mode} = req.body;
      database.connect(db=>{
        switch(mode){
          // adds 1 pull to a band, gig or user depending on what mode we recieved. That mode should be set in the route above
          case "bands":
          db.db('bands').collection('bands').updateOne({'_id':database.objectId(id)}, {$inc:{'pull':1}}, (err1, res1)=>{
            if (err1){
              console.log('There was an an error incrementing pull for band:: ' + err1);
              res.status(500).end();
              db.close();
            }
            else{
              console.log('Incremented pull of band: ' + id);
              res.redirect('/about');
              db.close();
            }
          });
          break;
          case 'gigs':
          db.db('gigs').collection('gigs').updateOne({'_id':database.objectId(id)}, {$inc:{'pull':1}}, (err1, res1)=>{
            if (err1){
              console.log('There was an error incrementing pull for gig: ' + err1);
              res.status(500).end();
              db.close();
            }
            else{
              console.log('Incremented pull of gig: ' + id);
              res.redirect('/about');
              db.close();
            }
          });
          break;
          case 'users':
          db.db('users').collection('users').updateOne({'username':id}, {$inc:{'pull':1}}, (err1, res1)=>{
            if (err1){
              console.log('There was an error incrementing pull for user: ' + err1);
              res.status(500).end();
              db.close();
            }
            else{
              console.log('Incremented pull of user: ' + id);
              res.redirect('/about');
              db.close();
            }
          });
          break;
          default:
          console.log('No recognized mode in add_pull: ' + mode);
          res.status(401).end();
          db.close();
          break
        }
      }, errDB=>{
        console.log('There was an error connectiong to mongo: ' + errDB);
        res.status(500).end();
      })
    }
  });

  //route to get request for getting a facebook token, redirects to predefined passport callback in server.js
  router.get('/login/facebook', passport.authenticate('facebook', { scope: [
    'user_friends',
    'manage_pages',
    'user_location',
    'user_likes',
    'user_posts',
    'user_age_range',
    'manage_pages',
    'pages_show_list',
    'publish_pages',
    'publish_to_groups',
    'public_profile',
    ]}
  ));

  //route to get request for getting the facebook token with ONLY instagram permissions
  router.get('/login/instagram', passport.authenticate('facebook', { scope: [
    'instagram_basic',
     //'instagram_content_publish', uncomment this when/if this feature leaves closed beta
    'instagram_manage_comments',
    'instagram_manage_insights',
    'ads_management',
    'manage_pages',
    'business_management']}));

  //route redirect from passport callback
  router.get('/return',
    passport.authenticate('facebook', { failureRedirect: '/facebookLoginFailed' }),
    function(req, res) {
      //redirect to success route
      res.redirect('/facebookLoginSuccess');
    });

  //route for successful login
  router.get('/facebookLoginSuccess', (req, res)=>{
    res.send("success")
  })

  //route for failed login
  router.get('/facebookLoginFailed', (req, res)=>{
    res.send("failure")
  })

  //route for a promoter to add a promotion that users can apply for through our website with a given code
  router.post('/createDiscountPromo', (req, res)=>{
    var {name, details, venue, date, location, medias, code, promoNumber} = req.body;
      database.connect(db=>{
        //store the promotion in the database
        db.db('promotions').collection('discounts').insertOne({
          'name':name,
          'details':details,
          'venue':venue,
          'date':date,
          'location':location,
          'medias':medias,
          'code':code,
          'promoNumber':promoNumber}, (err2, res2)=>{
          if (err2){
            console.log('There was an error setting promotion: '+name+' for user: ' +req.session.key+' Error: ' + err2);
            res.status(500).end();
            db.close();
          }
          else{
            console.log('Set promotion ' +name+ ' for user: '+req.session.key);
            //todo: insert code to post promotions to various social media here



            res.status(200).send('Congratulations, you have created a promotion for your users! ')
          }
        });
      }, dbErr=>{
        console.log('There was an error connecting to mongo: ' + dbErr);
        res.status(500).end();
      });
  })

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  //route for generating a discount code for a user from an existing promo code
  router.post('createDiscountCode', (req, res) => {
    var code = req.body;
    database.connect(db => {
      db.db('promotions').collection('discounts').find({'code': code}).toArray(function(err2, result) {
        if (err2){
          console.warn("Couldnt get gigs: " + err2);
          res.status(500).end();
          db.close();
        }
        else{
          console.log(result);
          const customerCode = makeid(7)
          const code = result[0].code

          //store the customers code in the db with the promotion code to look up the promo later
          db.db('promotions').collection('customer_discounts').insertOne({
            'customerCode': customerCode,
            'code': code
          }, (err2, res2)=>{
            if (err2){
              console.log('There was an error setting promotion: '+name+' for user: ' +req.session.key+' Error: ' + err2);
              res.status(500).end();
              db.close();
            }
            else{
              //send the user the code to redeem their discount
              res.status(200).send({'customerCode': customerCode, 'code': code})
            }
          });
          res.status(200).send(result);
          db.close();
        }
      });
    }, err => {
      console.warn("Couldn't connect to database: " + err)
      res.status(500).end()
    });
  })

  //todo: write a route to verify a customers code with a code base in the promotionis db

  router.get('/user_has_socials', (req, res)=>{
    if (!req.session.key){
      console.log('No logged in user tried to see if it has socials');
      req.status(404).end();
    }
    if (!req.query){
      console.log('user_has_socials had no query');
      req.status(401).end();
    }
    else{
      database.connect(db=>{
        db.db('users').collection('users').findOne({'username':req.session.key}, (err1, ourUser)=>{
          if (err1){
            console.log('there was an error finding user: ' + req.session.key+' Error: ' + err1);
            res.status(500).json({'success':false, 'data':null});
            db.close();
          }
          else{
            var socials = {'twitter':false, 'facebook':false, 'instagram':false, 'snapchat':false};
            if (ourUser.hasOwnProperty('twitter')){
              socials['twitter']=true;
            }
            if (ourUser.hasOwnProperty('facebook')){
              socials['facebook']=true;
            }
            if (ourUser.hasOwnProperty('instagram')){
              socials['instagram']=true;
            }
            if (ourUser.hasOwnProperty('snapchat')){
              socials['snapchat']=true;
            }
            res.status(200).json({'success':true, 'data':socials});
            db.close();
          }
        });
      }, dbErr=>{
        console.warn("Couldn't connect to database: " + err)
        res.status(500).json({'success':false, 'data':null});
      });
    }

  });





} //end of exports