# Integración Google Assistant y nodeMCU
### Descripción: 
Les traigo un pequeño ejemplo tutorial de como integrar Google Assistant y nodeMCU, para crear un asistente virtual, Un bot que responde a comandos de voz y realiza acciones en hardware. 
#####  ¿Como es que funciona?
Se realiza la conexion de varios sistemas, para lograr esta integracion, siendo mas precisos de trata de un sistema distribuido. Donde se utiliza:
 * Google Assistant y Dialogflow para el reconocimiento de voz
 * Cloud Functions en Firebase, que apartir de los datos reconocidos por Google Assistant, realiza una o varias acciones, que se refleja en una base de datos en tiempo real, a esto se le denomina Webhook.
 * Firebase Realtime Database, sera nuestra base de datos en tiempo real, el cual recibira cambios desde el webhook o desde nuestro hardware realizado en nodeMCU
 * NodeMCU, a través del leguaje processing, realizara una conexión con firebase, y apartir de la lectura de datos, realiza una accion un circuito (hardware)
 
Para una mejor comprención veamoslo en una gráfica: 
![diagrama de funcionamiento](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/diagrama-funcional-google-assistant-con-nodemcu.png)

Genial, ¿te interesa más ahora?, si es así, prueba nuestro demo; para eso necesitaras.
### Requisitos:
* Una cuenta en Google Assistant (el registro es gratis)
* Tener instalados NodeJS y npm >= v8* 
* Un editor de codigo de tu elección (VSCode)
* ArduinoIDE  (opcionalmente se pude configurar VScode para compilar y cacrgar archivos .ino)
* un modulo NodeMCU
* un par de luces led
#### Importar Agente
* Crea una cuenta en [Google Assistant](https://developers.google.com/assistant), haz click en "Go to Actions console" acepta los terminos y condiciones
* Haz un click en "new project" , asigna un nombre a tu proyecyo, el lenguaje (para este ejemplo el lenguaje es en `español` y no en ingles como en la imagen de ejemplo), posteriormente si es de su adrado se pueden añadir otros idiomas opcionales mas, y create project.
![new-project](https://codelabs.developers.google.com/codelabs/actions-1/img/f91664aa75c4a5f5.png)
* En lugar de elegir una categoría, desplácese hacia abajo hasta la sección Más opciones y haga clic en la tarjeta Conversacional .
![elegir categoria](https://codelabs.developers.google.com/codelabs/actions-1/img/4241cbc92f5c6b42.png)
* Haga clic en Agregar su primera acción . En el cuadro de diálogo Crear acción , seleccione Intención personalizada y haga clic en Crear. Eso abre la consola de Dialogflow en otra pestaña.
![add-action](https://codelabs.developers.google.com/codelabs/actions-1/img/baee8f25a1165377.png)
* Una vez dentro de la pagina,  esto te redireccionara en una nueva pestaña a Dialogflow, en el cual se autocompletaran los datos de tu proyecto de forma automática, en conexión con actions on google, a continuacion click en crear.
![add-action-dialogflow](https://codelabs.developers.google.com/codelabs/actions-1/img/283b838d7220938c.png)
* finalmente dentro de tu proyecto de Dialogflow, importa el archivo `sucre-Devfest.zip` que se encuentra en la raiz del repositorio.
![import-dialogflow](https://codelabs.developers.google.com/codelabs/actions-2/img/fa48f4fdf201bac5.png)

Si quieres conocer mejor como funciona podrias realizar un pequeño curso gratuito  para la creación de agentes inteligentes con Actions on Google y Dialgowflow, en estos codelabs encontraras los mismos pasos que te describo aqui con mas detalle aún, Ademas de compreender como funciona un agente y personalizarlo. `recomendado`.
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
Inicia secion en Firebase desde la consola de comandos `firebase login`, si ya iniciaste sesión con anterioridad, es posible que ya haya expirado, sin embargo la consola aun recuerda la sesión y podria ocacionarte errores. para ello utiliza el comando `firebase logout`
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
Mientras se ejecuta elcomando, notara una abvertencia, que dise que Node v8 ya se encuentra deprecado, esto es devido a que actualmente Firebase esta actualizando sus servicios a node  > v10*, y la v8 empesara a quedar sin soporte a partir del 15 de febrero del 2021.
Para utilizar la node v10, adicionalmente se debe cambiar el proyecto a una cuenta `blaze`, para lo cual se debera asociar una tarigeta debito o de credito, no tengas miedo, una cuenta blaze ofrece adicionalemente el consumo gratuito incluido en la cuenta spark. y adicionalemente GCP te regala 300$ para el consumo durante un año a cuentas nuevas.

Direjete a tu  cuenta de Firebase y copia, el link de tu cloud function 
![cloud-function](https://codelabs.developers.google.com/codelabs/actions-2/img/7cd67643a3295f3c.png)
posteriormente en tu cuenta de DialogFlow, activa controlar desde un WebHook y pega el link antes copeado y dale en guardar
![webhook](https://codelabs.developers.google.com/codelabs/actions-2/img/d0b8040d536bf011.png)

Para mas detalle sobre estos pasos pudes reavisar el codelab level 2, en donde se explica a detalle todo este proceso [Curso level 2](https://codelabs.developers.google.com/codelabs/actions-2/#0).

#### Configuraciones del proyecto
  *  ##### Conexion de tu webhook con Firebase Realtime Database 
  Crea tu base de datos en  firebaseDatabase y base de datos de prueba
![create-database](https://koenig-media.raywenderlich.com/uploads/2018/03/09b-Rules-Test-Mode.png)
a continuación crea la estructura de tu eleción, para este ejemplo es el siguiente

 







