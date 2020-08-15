# Integración Google Assistant y nodeMCU
### Descripción: 
Les traigo un pequeño ejemplo tutorial de como integrar Google Assistant y nodeMCU, para crear un asistente virtual, Un bot que responde a comandos de voz y realiza acciones en hardware. 
#####  ¿Como es que funciona?
Se realiza la conexion de varios sistemas, para lograr esta integracion, siendo mas precisos de trata de un sistema distribuido. Donde se utiliza:
 * Google Assistant y Dialogflow para el reconocimiento de voz
 * Cloud Functions en Firebase, que apartir de los datos reconocidos por Google Assistant, realiza una o varias acciones, que se refleja en una base de datos en tiempo real, a esto se le denomina Webhook.
 * Firebase Realtime Database, sera nuestra base de datos en tiempo real, el cual recibira cambios desde el webhook o desde nuestro hardware realizado en nodeMCU
 * NodeMCU, a través del leguaje processing, realizara una conexión con firebase, y apartir de la lectura de datos, realiza una accion un circuito (hardware) 
Para una mejor complención veamos lo en una gráfica: 
![diagrama de funcionamiento](https://github.com/armandohackcode/google-assistant-with-nodemcu/blob/developer/img/diagrama-funcional-google-assistant-con-nodemcu.png)


