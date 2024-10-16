# NgWhatsappSend

Este es un proyecto en Angular 17 para automatizar los procesos de comunicación vía whatsapp.

Consiste en una parte frontend que tiene un panel donde se introduce el mensaje y permite:
- Subir un archivo csv con los números de teléfono a enviar
- Enviar a números específicos el mensaje introducido (a modo de prueba antes de hacer el envío masivo)

Esto se hace mediante una librería llamada [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js) que permite habilitar un whatsapp web interno y expone APIs que permite operaciones como enviar y responder mensajes, enviar archivos, entre otros. Para ello es necesario escanear el código QR que se genera tal cual como haríamos desde el navegador. Esto solo se requiere hacer una vez.

> [!IMPORTANT]
> **No hay garantías de que tu cuenta de Whatsapp no sea bloqueada usando este método. WhatsApp no permite el uso de bots ni clientes no oficiales, por lo tanto no deberías considerar esta solución totalmente segura.**


# Instalación
1. Instalar nodejs en su versión [20.10.0](https://nodejs.org/download/release/v20.10.0/). Descargar la versión adecuada para su Sistema Operativo. Ej: `node-v20.10.0-x64.msi` si es windows 64bits, luego instalarlo
1. Modificar el archivo src\environments\environment.ts el tiempo de envío. Está expresado en milisegundos. Por defecto son 3 segundos pero puede modificarse para reducir o aumentar el tiempo. Tener en cuenta que a menos tiempo es mas probable que Whatsapp nos pueda banear el número y a más tiempo se demorará más en hacer envíos.
1. Ejecutar el archivo start_front.bat que instalará todas las dependencias del panel de envío de mensajes y correrá el proyecto en local en la dirección [http://localhost:4200](http://localhost:4200)
1. Ejecutar el archivo start_back.bat que instalará todas las dependencias del servicio que permite el envío de mensajes por whatsapp en local en la dirección [http://localhost:3000](http://localhost:3000)

Nota: La primera vez que se inicie el proyecto de backend, se iniciará con el proceso de vinculación de whatsapp por lo que en la consola se desplegará un código QR que se debe escanear desde la opción "Vincular dispositivo" en la aplicación de Whatsapp. Luego, una carpeta con nombre `.wwebjs_auth` será creada y almacenará los datos de la sesión y mensajes. Todos los mensajes que se envíen serán en nombre de dicha cuenta.

Si se requiere cerrar la sesión se puede hacer desde la aplicación de whatsapp y eliminando la carpeta `.wwebjs_auth`

Una vez en la consola de backend (donde se mostró el codigo QR) se muestre el texto "Client is ready!" estará todo listo para enviar mensajes.

## Archivo CSV para envío masivo

En la ruta `/home` se tiene la opción de envío masivo. Se debe escribir un mensaje y adjuntar un archivo csv exportado con excel con números de teléfono separados por saltos de línea (valor por defecto de excel).

El formato de este archivo y de los números debe ser como el siguiente:

`<prefijo de pais sin signo de suma>` + `<número de telefono>`

Ej:

```
51987654321
51234567891
```

Una vez cargado el archivo, se debe presionar el botón enviar y se mostrará un mensaje de confirmación con el número total de contactos a los que se le enviará el mensaje. Al darle continuar el proceso se ejecuta y la unica forma de detenerlo es recargando la página.

## Envío de prueba

En la ruta `/message-test` se tiene la opción de envío de prueba. Se debe escribir un mensaje y colocar uno o varios números separados por coma en el cuadro de texto. 

El formato ingresado en el cuadro de texto y de los números debe ser como el siguiente:

`<prefijo de pais sin signo de suma>` + `<número de telefono>`

Ej:

```
51987654321,51234567891
```
Al presionar enviar el mensaje se enviará a los números especificados (**NO SE MUESTRA PANTALLA DE CONFIRMACIÓN**). La finalidad de esta opción es para poder testear el formato del mensaje (negritas, cursivas, tildes, etc).

El proyecto soporta el uso de tildes y emojis también.

Made with ❤ by Isaac Yriarte <<isaacyagi@gmail.com>>
