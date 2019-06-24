// Globals
var createCouponState = false;
//user has logged in to these socials
var hasSnap = false;
var hasInsta = false;
var hasFB = false;
var hasYT = false;
var hasTwitter = false;

// user has created a promo targeting these socials
var promotionOnSocial1 = false;
var promotionOnSocial2 = false;
var promotionOnSocial3 = false;
var promotionOnSocial4 = false;

// for seeing if we have enoguh info to do a coupon
//CHANGE TO FLASE
var promoCreated = true;
var the_promo_ID = "";
//if the user has made gigS
var hasGigs = false;
var ourUser = {};

var isPromo;

class SearchResult {

  constructor(obj){
    this.id = obj._id;
    this.name = obj.username;
    this.newDiv = document.createElement("div");
    this.newDiv.style.backgroundImage = "url('/assets/Home/Art/12.jpeg')";
    // overlay
    this.newOverlay = document.createElement("div");
    this.newOverlay.className = "result-overlay";
    this.overlayID = "result-overlay-"+this.id;
    this.newOverlay.addEventListener('click', function(){
      // nothing yet
    });
    this.newOverlay.setAttribute("id",this.overlayID);
    // button
    this.addContactBtn = document.createElement("input");
    this.addContactBtn.type = "button";
    this.addContactBtn.value = "add contact";
    this.addContactBtn.className = "add-contact-btn";
    // frame
    this.newFrame = document.createElement("img");
    this.newFrame.className = "result-frame";
    this.newFrame.src = "/assets/Control-Center/redbox.png";
    this.newFrame.alt = "frame";
    // name
    this.nameDiv = document.createElement("div");
    this.nameDiv.className = "result-name-div";
    this.nameP = document.createElement("p");
    this.nameP.innerHTML = this.name;
    // appends
    this.newOverlay.appendChild(this.addContactBtn);
    this.newDiv.appendChild(this.newOverlay);
    this.newDiv.appendChild(this.newFrame);
    this.nameDiv.appendChild(this.nameP);
    this.newDiv.appendChild(this.nameDiv);
    theGrid.appendChild(this.newDiv);
    // event listeners data preprocessing
    this.AddEventListeners(this);
  }

  AddEventListeners(obj){
    obj.newDiv.addEventListener("mouseover",function(){
      obj.newOverlay.style.zIndex = "8";
      obj.newOverlay.style.opacity = "1.0";
    },false);
    obj.newDiv.addEventListener("mouseout",function(){
      obj.newOverlay.style.zIndex = "-8";
      obj.newOverlay.style.opacity = "0";
    },false);
    obj.newDiv.addEventListener("click",function(){
      console.log(obj.id);
    },false);
    if(obj.hasOwnProperty('addContactBtn')){
      obj.addContactBtn.addEventListener("click",function(){
        sendContactRequest(obj.id, obj.name);
      });
    }
  }
}

function init(){
  setUpStepTwo();
  checkUserSocials();
  getGigs();

  let pageURL = window.location.href;
  var urlAux = pageURL.split('?');
  var urlVarStr = urlAux[1];
  var urlVars = urlVarStr.split('&');
  console.log(urlVarStr);
  console.log(urlVars[0]);
  console.log(urlVars[1]);
  console.log(urlVars[2]);
  // CHECKING THE URL ON PROMO HERE
  // ON REDIRECT FROM SOCIAL AUTH,
  // PAGE SKIPS TO STEP ONE
  isPromo = urlAux[1];
  // console.log(isPromo);

  if(isPromo){
    userClickStart();
  }
}
function getGigs(){
  $.get('/user', {'query':'nada'}, res=>{
    if (res==""){
      console.log('There was an error finding user info for our user.');
      return;
    }
    else{
      ourUser = res;
      console.log('Our user is: ' + JSON.stringify(ourUser));
      var username = res.username;
      $.get('/getGigs', {'creator':ourUser.username}, res=>{
        if (res==""){
          console.log('There was an error getting our gigs.');
          return;
        }
        else{
          var ourGigs = res;
          populateDropDown(ourGigs);
        }
      });
    }
  });
}

function populateDropDown(ourGigs){
  var selector = document.getElementById('coupon-select');
  if (ourGigs==null){
    hasGigs = false;
    return;
  }
  else{
    hasGigs = true;
    for (var g in ourGigs){
      var currGig = ourGigs[g];
      var gigDropTitle=document.createElement('option');
      gigDropTitle.innerHTML=currGig.name;
      gigDropTitle.setAttribute('value',currGig._id);
      gigDropTitle.setAttribute('id', currGig._id);
      selector.appendChild(gigDropTitle);
    }
  }


}
function setUpStepTwo(){
  document.getElementById("left-step").addEventListener("click",function(){
    if(!createCouponState){
      // already creating a promo, do nothing.
    }
    else{
      createCouponState = false;
      document.getElementById("right-step").classList.toggle('selected');
      document.getElementById("left-step").classList.toggle('selected');
      document.getElementById("coupon-div").style.display = 'none';
      document.getElementById("promo-div").style.display = 'block';
    }
  });
  document.getElementById("right-step").addEventListener("click",function(){
    if(createCouponState){
      // already creating a coupon, do nothing.
    }
    else{
      createCouponState = true;
      document.getElementById("right-step").classList.toggle('selected');
      document.getElementById("left-step").classList.toggle('selected');
      document.getElementById("promo-div").style.display = 'none';
      document.getElementById("coupon-div").style.display = 'block';
    }
  });
  document.getElementById("promo-file-preview").addEventListener("click",function(){
    $("#promo-file").trigger('click');
  });
}

function linkFacebook(){
  // TODO
}

function linkSnapchat(){
  // TODO
}

function linkTwitter(){
  // TODO
}

function linkInstagram(){
  // TODO
}

function userClickStart(){
  var btn = document.getElementById('get-started-btn');
  btn.onclick = "";
  document.getElementById('step-1-content').style.display = 'block';
  document.getElementById("step-1-h1").classList.toggle('deactivated');
  document.getElementById("step-1-h2").classList.toggle('deactivated');
  document.getElementById("step-1").classList.toggle('deactivated-step');
  document.getElementById('step-1').scrollIntoView(true);
}

function finishStepOne(){
  // show step 2
  document.getElementById("step-2").classList.toggle('deactivated-step');
  document.getElementById('step-2-content').style.display = 'block';
  document.getElementById("step-2-h1").classList.toggle('deactivated');
  document.getElementById("left-step").classList.toggle('deactivated');
  document.getElementById("right-step").classList.toggle('deactivated');
  if(createCouponState){
    document.getElementById("right-step").classList.toggle('selected');
    document.getElementById("coupon-div").style.display = 'block';
  }else{
    document.getElementById("left-step").classList.toggle('selected');
    document.getElementById("promo-div").style.display = 'block';
  }
  // deactivate step 1
  document.getElementById("step-1").classList.toggle('deactivated-step');
  document.getElementById('step-1-content').style.display = 'none';
  document.getElementById("step-1-h1").classList.toggle('deactivated');
  document.getElementById("step-1-h2").classList.toggle('deactivated');
  document.getElementById('step-2').scrollIntoView(true);

}

function goBackToStepOne(){
  document.getElementById("step-2").classList.toggle('deactivated-step');
  document.getElementById('step-2-content').style.display = 'none';
  document.getElementById("step-2-h1").classList.toggle('deactivated');
  document.getElementById("right-step").classList.toggle('deactivated');
  document.getElementById("left-step").classList.toggle('deactivated');
  if(createCouponState){
    document.getElementById("right-step").classList.toggle('selected');
  }else{
    document.getElementById("left-step").classList.toggle('selected');
  }

  document.getElementById("step-1").classList.toggle('deactivated-step');
  document.getElementById('step-1-content').style.display = 'block';
  document.getElementById("step-1-h1").classList.toggle('deactivated');
  document.getElementById("step-1-h2").classList.toggle('deactivated');

  document.getElementById('step-1').scrollIntoView(true);
}

function finishStepTwo(){
  document.getElementById("step-2").classList.toggle('deactivated-step');
  document.getElementById('step-2-content').style.display = 'none';
  document.getElementById("step-2-h1").classList.toggle('deactivated');
  document.getElementById("right-step").classList.toggle('deactivated');
  document.getElementById("left-step").classList.toggle('deactivated');
  if(createCouponState){
    document.getElementById("right-step").classList.toggle('selected');
  }else{
    document.getElementById("left-step").classList.toggle('selected');
  }

  document.getElementById("step-3").classList.toggle('deactivated-step');
  document.getElementById('step-3-content').style.display = 'block';
  document.getElementById("step-3-h1").classList.toggle('deactivated');
  document.getElementById("step-3-h2").classList.toggle('deactivated');

  document.getElementById("step-3").scrollIntoView(true);

}

function goBackToStepTwo(){
  document.getElementById("step-3").classList.toggle('deactivated-step');
  document.getElementById('step-3-content').style.display = 'none';
  document.getElementById("step-3-h1").classList.toggle('deactivated');
  document.getElementById("step-3-h2").classList.toggle('deactivated');

  document.getElementById("step-2").classList.toggle('deactivated-step');
  document.getElementById('step-2-content').style.display = 'block';
  document.getElementById("step-2-h1").classList.toggle('deactivated');
  document.getElementById("right-step").classList.toggle('deactivated');
  document.getElementById("left-step").classList.toggle('deactivated');
  if(createCouponState){
    document.getElementById("right-step").classList.toggle('selected');
  }else{
    document.getElementById("left-step").classList.toggle('selected');
  }

  document.getElementById("step-2").scrollIntoView(true);
}

function finishStepThree(){
  // Todo
}


//Minh CODE:

function showCreatePromo(){
    var promo =  document.getElementById("create-your-promotion-body");
    if (promo.style.display === "none") {
        promo.style.display = "block";
      } else {
        promo.style.display = "none";
      }
}

function showCreateSpecialPromo(){
    var promo =  document.getElementById("create-special-promo-body");
    if (promo.style.display === "none") {
        promo.style.display = "block";
      } else {
        promo.style.display = "none";
      }
}

function parseURL(url){
  var parser = document.createElement('a'),
       searchObject = {},
       queries, split, i;
   // Let the browser do the work
   parser.href = url;
   // Convert query string to object
   queries = parser.search.replace(/^\?/, '').split('&');
   for( i = 0; i < queries.length; i++ ) {
       split = queries[i].split('=');
       searchObject[split[0]] = split[1];
   }
   return {
       protocol: parser.protocol,
       host: parser.host,
       hostname: parser.hostname,
       port: parser.port,
       pathname: parser.pathname,
       search: parser.search,
       searchObject: searchObject,
       hash: parser.hash
   };
}

//BOOTH CODE SECTION
function displayUploadImage(input) {
  console.log('GOT IN DISPLAY')
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#promo-file-preview')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function submit_promotion(){
  console.log('SAVE PROMO HIT')
  var name = document.getElementById('promo-name').value;
  console.log('PROMO NAME: ' + name)
  if (name == " " || name == null){
    alert('Sorry, you must give your promotion a name to save it.');
    return;
  }
  var loc = document.getElementById('promo-loc').value;
  if (name == " " || name == null){
    alert('Sorry, you must give your promotion a location to save it.');
    return;
  }
  var url_text = document.getElementById('promo-url').value;
  if (url_text == " " || url_text == null){
    alert('Sorry, you must give your promotion a name to save it. This url is what user traffic will be driven to.');
    return;
  }
  var desc = document.getElementById('promo-description').value;
  if (desc == " " || desc == null){
    alert('Sorry, you must give your promotion a caption to save it.');
    return;
  }
  if(!($("#promo-file")[0].files && $("#promo-file")[0].files[0])){
    alert('Sorry, you must give your promotion a image or video to save it.');
    return;
  }
  else{
    console.log('FILE IS: '+ JSON.stringify($("#promo-file")[0].files[0]));
    if (!($("#promo-file")[0].files[0].type=='image/jpeg' || $("#promo-file")[0].files[0].type=='image/png' || $("#promo-file")[0].files[0].type=='video/mp4')){
      alert('Sorry, the file you select must be a valid image ending with .jpeg or .png or a valid video ending with .mp4');
      return;
    }
  }
  if (!promotionOnSocial1 && !promotionOnSocial2 && !promotionOnSocial3 && !promotionOnSocial4){
    alert('Sorry, you must select at least one social media to target with this pomotion. You can click on your targted medias at the bottom of the form.');
    return;
  }
  var medias = []
  if (promotionOnSocial1){
    medias.push('facebook');
  }
  if (promotionOnSocial2){
    medias.push('instagram');
  }
  if (promotionOnSocial3){
    medias.push('snapchat');
  }
  if (promotionOnSocial4){
    medias.push('twitter');
  }
  var formdata = new FormData;
  var promoPic = $("#promo-file")[0].files[0];
  formdata.append('promoPic', promoPic);
  $.ajax({
      url: '/uploadPromoPic',
      data: formdata,
      contentType: false,
      processData: false,
      type: 'POST',
      'success':function(data){
        if (data){
          if (data == "Wrong mimeType"){
            alert('Sorry, currently we only support .png or .jpeg files for promotions.');
            return;
          }
          else{
            var imageURL = 'www.banda-inc.com/'+data;
            console.log('GOT RES FROM UPLOAD: ' + imageURL);
            $.post('/promotion', {'name':name, 'caption':desc, 'location':loc, 'medias':medias, 'imgURL':imageURL, 'handles':url_text}, res=>{
              alert(res.message);
              console.log('PROMO RES: ' + JSON.stringify(res));
              promoCreated = true;
            });
          }
        }
        else{
          alert('Hmmm...it seems something went wrong with uploading your file. Please refresh the page and try again. If this problem persists please email us using "support" from the Banda "b". Thank you.')
          return;
        }
      }
    });
  //


}
//CLICKS for selecting socials for promo
function clickedSocial1(){
  document.getElementById("promo-fb").classList.toggle('deactivated-social');
  promotionOnSocial1 = !promotionOnSocial1;
}
function clickedSocial2(){
  document.getElementById("promo-insta").classList.toggle('deactivated-social');
  // promotionOnSocial2 = !promotionOnSocial2;
}
function clickedSocial3(){
  document.getElementById("promo-snap").classList.toggle('deactivated-social');
  // promotionOnSocial3 = !promotionOnSocial3;
}
function clickedSocial4(){
  document.getElementById("promo-twitter").classList.toggle('deactivated-social');
  promotionOnSocial4 = !promotionOnSocial4;
}

function submit_coupon(){
  console.log('clicked submit coupon');
  if (!hasGigs){
    console.log('User has no gigs');
    alert('Sorry, you must create an event to create a coupon. Coupons are tied to a specific event you have created so that we can autofill information and optimize your promotions reach. Go to "home" on the Banda "b" and click "post event" to create an event.');
    return;
  }
    console.log('User has not created a promo on this page yet.');
    $.get('/aUserPromo', {'stuff':'lol'}, res=>{
      if (!res.success){
        console.log('User promo failed');
        alert('Sorry, you must create and save a promotion first in order to create a coupon. We need the information from the promotion form to optimize your coupons reach.');
        return;
      }
      else{
        if (res.data==null){
          alert('Sorry, you must create and save a promotion first in order to create a coupon. We need the information from the promotion form to optimize your coupons reach.');
          return;
        }
        else{
          if (res.data.length==0){
            alert('Sorry, you must create and save a promotion first in order to create a coupon. We need the information from the promotion form to optimize your coupons reach.');
            return;
          }
          else{
            var thePromo = res.data[res.data.length-1];
            var promoID = thePromo._id;
            var coupBody = document.getElementById("coupon-text").value;
            if (coupBody == "" || coupBody == " "){
              alert('Sorry, you must write a non-blank description for your coupon to save it. The description is where you write the details of what the coupon grants a customer, (ex. "5% off your first drink of the night").')
              return;
            }
            else{
              var selectedGig = $('#coupon-select option:selected').data();
              console.log('options: ' + JSON.stringify($('#coupon-select option:selected')));
              console.log('GIG: ' + JSON.stringify(selectedGig));
              selectedGig=selectedGig['id'];
              console.log('Seleced gig: ' + selectedGig);
              var gigID = $('#coupon-select option:selected').val();
              console.log('gigID for promo: ' + gigID);
              $.post('/createDiscountPromo', {'gigID':gigID, 'promoID':promoID, 'details':coupBody}, res2=>{
                console.log('got in res for create coupon')
                if (res2==null){
                  alert('Hmmm....something went wrong on our end. Please refreash the page an try again. If this problem persits contact our live support tean by clicking on the Banda "b" and then clicking "support".');
                  return;
                }
                else if (res2=="" || res2==" "){
                  alert('Hmmm....something went wrong on our end. Please refreash the page an try again. If this problem persits contact our live support tean by clicking on the Banda "b" and then clicking "support".');
                  return;
                }
                else{
                  alert(res2);
                  return;
                }
              });
            }

          }
        }

      }
    });
}
function checkUserSocials(){
  $.get('/user_has_socials', {'name':'anything'}, res=>{
    console.log(res);
    if(res.success){
      if(res.data.twitter){
        hasTwitter=true;
      }
      if(res.data.facebook){
        hasFB=true;
      }
      if(res.data.instagram){
        hasInsta=true;
      }
      if(res.data.snapchat){
        hasSnap=true;
      }
      console.log('SOCIALS FRO USER IS (true means we already have their info for that social): ' + JSON.stringify(res.data));
    }
    else{
      console.log('There was an error using this route');
      return;
    }
  });
}
document.getElementById("search-bar-input").addEventListener('keyup', function(e){
  console.log('KEY UP code: ' + e.keyCode);
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    promoSearch();
  }
});

var theGrid = null;

function promoSearch(){
  theGrid = document.getElementById("grid-container");
  theGrid.style.display = "grid";
  while(theGrid.hasChildNodes()){
    console.log("removing children");
    theGrid.removeChild(theGrid.lastChild);
  }
  console.log('PErform serach');
  var searchText = $("#search-bar-input").val();
  console.log('SEARCH: ' + searchText);
  if (searchText==" " || searchText==''){
    alert('Sorry, you must eneter search text to perform a search.');
    return;
  }
  var zipcode = $('#step-3-zip').val();
  if (zipcode=="" || zipcode==" " ){
    alert('Sorry, you must enter a zipcode to perform a promoter search. We do this to let you target specific areas.');
    return;
  }
  var mySearch = {'zipcode':zipcode, 'text':searchText};
  convertZip(mySearch);
  console.log('searchText: ' + searchText);

}

function convertZip(mySearch){
  var zipcode = mySearch.zipcode;
  if (!(zipcode.length==5)){
    alert('Please enter a valid zipcode.');
    return;
  }
  var success = false;
  setTimeout(function() {
    if (!success)
    {
        // Handle error accordingly
        console.log("Got error with zipcode");
        alert("Please enter a valid zipcode.");
        return;
    }
  }, 5000);
    $.getJSON('https://api.openweathermap.org/data/2.5/weather?zip='+zipcode+',us&APPID=f89469b4b424d53ac982adacb8db19f6').done(function(data){
      console.log(JSON.stringify(data));
      success=true;
      var lat = data.coord.lat;
      var lng = data.coord.lon;
      $.get('/search_promos', {'lat':lat, 'lng':lng, 'searchText':mySearch.text}, res3=>{
        alert(JSON.stringify(res3));
        fillResultsTable(res3['data']['overallMatchers']);
        // console.log(JSON.stringify(res3['data']['overallMatchers']));
      });
  });
}

function fillResultsTable(resArr){
  var results = [];
  for(user in resArr){
    results[user] = new SearchResult(resArr[user][0]);
  }

}
function sendContactRequest(recieverID, name){
  var now = new Date().toString();
  console.log('about to send contact request: sender id: ' + ourUser._id)
  console.log('reciever id is: ' + recieverID);
  $.post('/messages', {'senderID':ourUser._id, 'recieverID':recieverID, 'body':'<button id="'+recieverID+'">'+ourUser.username+'"wants to connect with you."</button>', 'timeStamp':now}, res=>{
    alert('We have sent your contact request to ' + name + ' check your contacts tab often to see if they have accepted, and been added to your contacts.');
  });
}
function requestSupport(){
  var supportText = document.getElementById("request-support-textarea").value;
  console.log("User has requested support, text is: ");
  console.log(supportText);
  if (supportText == "" || supportText == " " || supportText == null){
    alert('Please enter some text to send to us if you would like to receive help. Thank You!');
    return;
  }
  $.post('/contact_support', {message: supportText}, res=>{
    alert(res);
    var modal = document.getElementById("modal-wrapper-support");
    modal.style.display = "none";
  });
}

function populateSelectSocialPageModal(data){
  var selector = document.getElementById("ssp-select");
  jQuery(function($) {
    $('#ssp-select').change(function () {
      var optionSelected = $(this).find("option:selected");
      var valueSelected  = optionSelected.val();
      var textSelected   = optionSelected.text();
      console.log("VALUE SELECTED IS: "+valueSelected);
      console.log("TEXT SELECTED IS: "+textSelected);
    });
  });
  for(var index in data){
    var page = document.createElement('option');
    page.value = data[index].id;
    page.innerHTML = data[index].name;
    selector.append(page);
  }
}
