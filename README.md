# Integración Google Assistant y nodeMCU
### Descripción:
Les traigo un pequeño ejemplo tutorial de como integrar Google Assistant y nodeMCU, para crear un asistente virtual, Un bot que responde a comandos de voz y realiza acciones en hardware.
#####  ¿Como  funciona?
Se realiza la conexión entre varios sistemas, para lograr esta integración, siendo mas precisos de trata de un sistema distribuido. Donde se utiliza:
* Google Assistant y Dialogflow para el reconocimiento de voz
* Cloud Functions en Firebase, que a partir de los datos reconocidos por Google Assistant, realiza una o varias acciones, que se refleja en una base de datos en tiempo real, a esto se le denomina Webhook.
* Firebase Realtime Database, sera nuestra base de datos en tiempo real, el cual recibirá cambios desde el webhook o desde nuestro hardware realizado en nodeMCU
* NodeMCU, a través del lenguaje processing, realizará una conexión con firebase, y a partir de la lectura de datos, realiza una acción en el circuito (hardware)
Para una mejor comprensión veámoslo en una gráfica:
![diagrama de funcionamiento](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/diagrama-funcional-google-assistant-con-nodemcu.png?raw=true)
 
Genial, ¿te interesa más ahora?, si es así, prueba nuestro demo; para eso necesitarás.
 
### Requisitos:
* Una cuenta en Actions on Google (el registro es gratis)
* Una cuenta en Firebase
* Tener instalados NodeJS y npm >= v8*
* Un editor de código de tu elección (VSCode)
* Arduino IDE  (opcionalmente se puede configurar VS code para compilar y cargar archivos .ino)
* un módulo NodeMCU
* un par de luces led
#### Importar Agente
* Crea una cuenta en [Google Assistant](https://developers.google.com/assistant), haz click en "Go to Actions console" acepta los términos y condiciones
* Haz un click en "new project" , asigna un nombre a tu proyecto, el lenguaje (para este ejemplo el lenguaje es en `español` y no en ingles como en la imagen de ejemplo), posteriormente si es de su agrado se pueden añadir otros idiomas opcionales más, y create project.
![new-project](https://codelabs.developers.google.com/codelabs/actions-1/img/f91664aa75c4a5f5.png)
* En lugar de elegir una categoría, desplácese hacia abajo hasta la sección Más opciones y haga clic en la tarjeta Conversacional .
![elegir categoria](https://codelabs.developers.google.com/codelabs/actions-1/img/4241cbc92f5c6b42.png)
* Haga clic en Agregar su primera acción . En el cuadro de diálogo Crear acción , seleccione Intención personalizada y haga clic en Crear. Eso abre la consola de Dialogflow en otra pestaña.
![add-action](https://codelabs.developers.google.com/codelabs/actions-1/img/baee8f25a1165377.png)
* Una vez dentro de la página,  esto te redireccionará en una nueva pestaña a Dialogflow, en el cual se auto completará los datos de tu proyecto de forma automática, en conexión con actions on google, a continuación click en crear.
![add-action-dialogflow](https://codelabs.developers.google.com/codelabs/actions-1/img/283b838d7220938c.png)
* finalmente dentro de tu proyecto de Dialogflow, importa el archivo `sucre-Devfest.zip` que se encuentra en la raíz del repositorio.
![import-dialogflow](https://codelabs.developers.google.com/codelabs/actions-2/img/fa48f4fdf201bac5.png)
 
Si quieres conocer mejor cómo funciona podrías realizar un pequeño curso gratuito  para la creación de agentes inteligentes con Actions on Google y Dialgowflow, en estos codelabs encontrarás los mismos pasos que te describo aquí con más detalle aún, Además de comprender cómo funciona un agente y personalizarlo. `recomendado`.
1. [Codelabs Google Assistant](https://developers.google.com/actions/codelabs/)
2. [Curso level 1](https://codelabs.developers.google.com/codelabs/actions-1/#0)
3. [Curso level 2](https://codelabs.developers.google.com/codelabs/actions-2/#0)
4. [Curso level 3](https://codelabs.developers.google.com/codelabs/actions-3/#0)
 
### Instalación:
Instala Firebase cli
```
$ npm -g install firebase-tools
```
Revisa que la versión sea igual o mayor a la v3.5.0
```
$ firebase --version
```
Inicia sesión en Firebase desde línea de comandos `firebase login`, si ya iniciaste sesión con anterioridad, es posible que ya haya expirado, sin embargo la consola aún recuerda la sesión y podría ocasionar errores. para ello utiliza el comando  `firebase logout` y continúa con la autentificación nuevamente.
```
$ firebase logout
$ firebase login
```
Clona el repositorio y ubicate en el directorio del proyecto
```
$ git clone https://github.com/armandohackcode/google-assistant-with-nodemcu.git
$ cd google-assistant-with-nodemcu
```
Selecciona tu proyecto en firebase que alojara el webhook
```
$ firebase use --project <PROJECT_ID>
```
Tip : Identificación de proyectos de su acción se puede encontrar en las acciones de consola en general > > Configuración del proyecto .
![IdProyecto](https://codelabs.developers.google.com/codelabs/actions-2/img/aa9e12fea8d7d971.png)
 
Bien, descarguemos las dependencias dentro de la carpeta `/functions`  del proyecto
```
$ cd functions
$ npm install
```
Ejecute el siguiente comando en la terminal para implementar su webhook en Firebase:
```
$ firebase deploy --project <PROJECT_ID>
```
Mientras se ejecuta el comando, notara una advertencia, que dice que Node v8 ya se encuentra deprecado, esto es debido a que actualmente Firebase está actualizando sus servicios a node  > v10*, y la v8 empezará a quedar sin soporte a partir del 15 de febrero del 2021.
Para utilizar la node v10, adicionalmente se debe cambiar el proyecto a una cuenta `blaze`, para lo cual se deberá asociar una tarjeta debito o de crédito, no tengas miedo, una cuenta blaze ofrece adicionalmente el consumo gratuito incluido en la cuenta spark. y adicionalmente GCP te regala 300$ para el consumo durante un año a cuentas nuevas.
 
Dirígete a tu  cuenta de Firebase y copia, el link de tu cloud function
![cloud-function](https://codelabs.developers.google.com/codelabs/actions-2/img/7cd67643a3295f3c.png)
posteriormente en tu cuenta de DialogFlow, activa controlar desde un WebHook y pega el link antes copiado y dale en guardar
![webhook](https://codelabs.developers.google.com/codelabs/actions-2/img/d0b8040d536bf011.png)
 
Para mas detalle sobre estos pasos pudes reavisar el codelab level 2, en donde se explica a detalle todo este proceso [Curso level 2](https://codelabs.developers.google.com/codelabs/actions-2/#0).
 
#### Configuraciones del proyecto
##### Conexión del webhook con Firebase Realtime Database
 Crea tu base de datos en  firebase Database y base de datos de prueba
![create-database](https://koenig-media.raywenderlich.com/uploads/2018/03/09b-Rules-Test-Mode.png)
a continuación crea la estructura de tu elección, para este ejemplo es el siguiente
![structura-base](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/estructura-base.png?raw=true)
Descarga la llave de tu proyecto, un archivo .json desde las configuraciones de tu proyecto en Firebase
![Key-firebase](https://miro.medium.com/max/3200/0*Cgq9b9BinVlDpRN9)
 
Copia el archivo .json en el siguiente directorio del proyecto `/functions/` (opcionalmente podrás renombrar el archivo a un nombre más corto por ejemplo `key-project.json`)
![directorio](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/key-json.png?raw=true)
Modifica el siguiente fragmento de código en en el archivo `index.js`
![framecnto-codigo](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/codigo-key.png?raw=true)
```
var serviceAccount = require("./key-project.json");
 
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://example.firebaseio.com"
});
```
Hasta este punto ya tendríamos todo listo para para hacer correr nuestro webhook, guarda los cambios y ejecuta el comando.`firebase deploy --project <PROJECT_ID>`
```
$ firebase deploy --project example-2123dds
```
#####  Configuraciones para NodeMCU
Necesitamos instalar un par de librerías en Arduino IDE para que nuestro proyecto funcione adecuadamente.
* Intalar la libreria ESP8266 y añade los modulos de complitación para arduino [Guía de instalación](https://aprendiendoarduino.wordpress.com/2017/09/13/programacion-esp8266-con-ide-arduino/)
* Descarga e instala la libreria de firebase para arduino [aquí](https://github.com/FirebaseExtended/firebase-arduino) descarga el repo en modo .zip y añadelo a ArduinoIDE
Edita el siguiente fragmento de código en el archivo `/control-node-mcu/control-node-mcu.ino`
![control-mcu](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/cod-hots.png?raw=true)
> FIREBASE_HOST  es el nombre del host de base de datos en firebase
> FIREBASE_AUTH  es el token de autorización obtenido desde firebase
![Database-secret](https://snappy.appypie.com/ckeditor/plugins/imageuploader/uploads/faqs//1339aa2434.png)
```
#define FIREBASE_HOST "example-aa3c3.firebaseio.com"
#define FIREBASE_AUTH "xxxxxxxxxxxxxxxxxxxxxxxx" //firebase token
```
Arma el circuito con nodeMCU
![nodemcu](https://cdn-tienda.bricogeek.com/4392-thickbox_default/nodemcu-v3-esp8266.jpg)
Toma en cuenta el diagrama referencial, para conectar a los pines adecuados
![circuito](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/nodeMCU.png?raw=true)
 
Finalmente hasta este punto todo el proyecto debería estar funcionando correctamente
### Explicación de Codigo
##### Como funciona el Webhook
Inicializamos  dialogflow client
```
const app = dialogflow({debug: true});
```
Cada Intent tiene una acción en el webhook con nodeJS, donde se especifica el nombre del Intent y los parámetros que va a recibir
```
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
   if (!permissionGranted) {
     conv.ask(`Ok, no te preocupes. ¿Como te puedo ayudar?`);
   } else {
     conv.user.storage.userName = conv.user.name.display;
     conv.ask(`Gracias, ${conv.user.storage.userName}. ¿Como te puedo ayudar hoy ?`);
    
   }
 });
```
Los parámetros que recibe, son las entities  relacionadas con las frases de entrenamiento del agente; si nuestro entity se denomina `objects` por ejemplo, los datos que contenga el entity serán los datos reconocidos por el intent. siempre y cuando la frase de entrada, tenga la misma estructura de una de las frases de entrenamiento del intent
![Fraces-de-entrenamiento](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/fraces-de-entrenamiento.png?raw=true)
 
Cada entity, puede contener todo un vocabulario de frases, contra más palabras sean agregadas, el agente tendrá mayor capacidad de identificación, así como más frases de entrenamiento con diferentes estructuras, mejora el entendimiento de un intent de usuario, donde una palabra puede ser identificada, por su nombre principal o los sinónimos que la comprenden.
![entities](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/entities.png?raw=true)
 
Entonces al cuando Dialogflow identifica un Intent, en el webhook se recibe de la siguiente forma
```
app.intent('actions_windows _and_doors', (conv, {actions,object}) => {
   // body
   // >actions
   conv.ask('respuesta');
}
```
`actions,object` pertenecen a los entities identificados, existen varios tipos de entities, como tambien tambien se puede realizar una estructura compuesta de entities, sin embargo eso ya es algo avanzado, y lo pueden consultar en la [documentación de dialogflow](https://cloud.google.com/dialogflow/docs/entities-overview?hl=es-419) o tambien en un video referencial [aquí](https://www.youtube.com/watch?v=x0SN8suJiSA).
 
El parámetro recibido, contenera, la palabra o frase identificada, esto nos permitirá identificarla y realizar una acción a partir de ello
```
if(actions == 'abrir' && object== 'ventana'){
   //actions
}
```
Existen muchas formas de armar una estructura de identificación, pero para este ejemplo se muestra una de las formas más sencillas. De ahí para adelante, simplemente ya es imaginación del programador, que accionar tomar, ya sea escribir algo en base de datos, leer de base de datos, o simplemente dar una respuesta generalizada, etc.
 
```
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
   }
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
```
##### Como funciona el NodeMCU Controller
Simplemente leemos y escribimos datos en Firebase, luego de las configuraciones inicializamos Firebase en void loop de la siguiente forma
```
Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
```
Leer los datos de firebase es muy sencillo, de la clase Firebase, accedemos al método getInt (en caso tratarse de un dato numérico) o getString (en caso tratarse de un String) todo esto y mas puede consultar los diferentes métodos de la clase Firebase en su [documentación](https://firebase-arduino.readthedocs.io/en/latest/)
```
int statusVentana = Firebase.getInt("habitacion/ventana");
```
Se hace solo una consulta, por cada cambio en la DB, los datos son actualizados en tiempo real.
 
Para escribir en base de datos, de igual forma es sencillo de realizar, la función setInt o setString, dependiendo del tipo de dato que se desea leer se hace de la siguiente forma
 
```
void writeDoor(int estado){
 Firebase.setInt("home/Door/estado", estado);
}
void writeTemperature(int temperatura, int estado,int ventilador){
  Firebase.setInt("home/Temperatura/estado", estado);
  Firebase.setInt("home/Temperatura/temperatura", temperatura);
  Firebase.setInt("home/Temperatura/ventilador", ventilador);
 delay(1000);
}
```
La ruta, especificada, debe ser según a la estructura existente en BD y podría variar, al criterio del programador,` recuerda en todo momento, que debes especificar la ruta absoluta de cada dato del cual deseas leer o sobreescribir`.
 
Genial !!!! Si llegaste a este punto ahora serás capaz de crear tu propio agente inteligente, que controle tu casa, un prototipo base de google home o domótica  y automatización.
 
#### Conclusiones
- Se logró crear con éxito un prototipo de bot que controla hardware mediante comandos de voz.
- Existen muchas formas de crear una estructura para un agente inteligente, y para un mejor desempeño del mismo se deben detallar las frases de entrenamiento, contextos, y eventos a los cuales responde.
- La aplicación entre en hardware y software puede escalar exponencialmente," el límite solo existe en la imaginación y habilidad del programador"
#### Siguientes pasos
- [Experiencias codelab](https://medium.com/orbismobile/my-experience-with-google-assistant-codelabs-and-why-you-should-also-take-them-right-now-8e7a77719d2c)
- [Conceptos de Dialogflow](https://cloud.google.com/dialogflow/docs/concepts)
- [Internationalization](https://medium.com/orbismobile/hello-salut-hola-internationalization-in-your-google-actions-772a63989c10)
- [External Request](https://medium.com/orbismobile/considerations-when-making-rest-requests-in-your-actions-a98e5dc35dd9)
- [Debugging of Actions](https://medium.com/@tohure/debugging-our-cloud-function-in-real-time-adfbf4ce3385)
 
 

