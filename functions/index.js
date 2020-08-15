
'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    BasicCard,
    Permission,
    Suggestions,
  } = require('actions-on-google'); 

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});


var admin = require("firebase-admin");

var serviceAccount = require("./sucre-devfest-ad6d9-firebase-adminsdk-uk883-84c7438d8c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sucre-devfest-ad6d9.firebaseio.com"
});

const ref = admin.database().ref('/');
    
// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    const name = conv.user.storage.userName;
    if (!name) {
      // Asks the user's permission to know their name, for personalization.
      conv.ask(new Permission({
        context: 'Hola, para conocerte mejor',
        permissions: 'NAME',
      }));
    } else {
      conv.ask(`Hola de nuevo, ${name}. ¿Como te puedo ayudar?`);
    }
  });
 //  
 // agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
      conv.ask(`Ok, no te preocupes. ¿Como te puedo ayudar?`);
    } else {
      conv.user.storage.userName = conv.user.name.display;
      conv.ask(`Gracias, ${conv.user.storage.userName}. ¿Como te puedo ayudar hoy ?`);
      
    }
  });
app.intent('actions_windows _and_doors', (conv, {actions,object}) => {
  var ref = admin.database().ref('/');
  if(actions == 'abrir' && object== 'ventana'){
    var ventana = getWindow(ref);
      if(ventana == 1){
        conv.ask('Las ventanas ya estan abiertas');
      }else{
        conv.ask('Abriendo ventanas');
        updateWindow(ref,1);
        conv.ask('Las ventanas an sido abiertas');
      }
    }else if(actions == 'cerrar' && object  == 'ventana'){
      var ventana = getWindow(ref);
        if(ventana == 0){
          conv.ask('Las ventanas ya estan cerradas');
        }else{
          conv.ask('Cerrando ventanas');
          updateWindow(ref,0);
          conv.ask('Las ventanas an sido cerradas');
        }
    }else if(actions == 'abrir' && object == 'puerta'){
      var puerta = getDoor(ref);
        if(puerta == 1){
          conv.ask('Las Puertas ya estan abiertas');
        }else{
          conv.ask('Abriendo Puertas');
          updateDoor(ref,1);
          conv.ask('Las puertas an sido abiertas');
        }
    }else if(actions == 'cerrar' && object  == 'puerta'){
      var puerta = getDoor(ref);
        if(puerta == 0){
          conv.ask('Las Puertas ya estan Cerradas');
        }else{
          conv.ask('Cerrando Puertas');
          updateDoor(ref,0);
          conv.ask('Las puertas an sido cerradas');
        }
    }else{
        conv.ask('Lo siento pero no identifico la acción');
    }
    conv.ask(`Lo siento proceso terminado ${actions} ${object}`);  
});

function getWindow(ref){
  var ventana ;
      ref.on("value", function(snapshot) {
          var data = snapshot.val();
          ventana = data.habitacion.ventana;
        });
  return ventana; 
}
function updateWindow(ref,value){
  var usersRef = ref.child("habitacion");
        usersRef.update({
          ventana:value
        });
}
function getDoor(ref){
  var puerta ;
      ref.on("value", function(snapshot) {
          var data = snapshot.val();
          puerta = data.habitacion.puerta;
        });
  return puerta;
}
function updateDoor(ref, value){
  var usersRef = ref.child("habitacion");
          usersRef.update({
            puerta:value
          });
}
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

