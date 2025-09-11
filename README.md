# NgWhatsappSend

Este es un proyecto en Angular 17 para automatizar los procesos de comunicación vía whatsapp.

Consiste en una parte frontend que tiene un panel donde se introduce el mensaje y permite:
- Subir un archivo csv con los números de teléfono a enviar
- Adjuntar un archivo para enviar a la lista en el excel
- Enviar a números específicos el mensaje introducido (a modo de prueba antes de hacer el envío masivo)
- Mapeo de variables especificadas en el excel

Esto se hace mediante una librería llamada [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js) que permite habilitar un whatsapp web interno y expone APIs que permite operaciones como enviar y responder mensajes, enviar archivos, entre otros. Para ello es necesario escanear el código QR que se genera tal cual como haríamos desde el navegador. Esto solo se requiere hacer una vez.

> [!IMPORTANT]
> **No hay garantías de que tu cuenta de Whatsapp no sea bloqueada usando este método. WhatsApp no permite el uso de bots ni clientes no oficiales, por lo tanto no deberías considerar esta solución totalmente segura.**


# Instalación
1. Instalar nodejs en su versión [20.10.0](https://nodejs.org/download/release/v20.10.0/). Descargar la versión adecuada para su Sistema Operativo. Ej: `node-v20.10.0-x64.msi` si es windows 64bits, luego instalarlo
1. Instalar Google Chrome puesto que la librería `puppeter` que utiliza `whatsapp-web.js` lo requiere
1. Modificar el archivo `src\environments\environment.ts` el tiempo de envío. Está expresado en milisegundos. Por defecto son 3 segundos pero puede modificarse para reducir o aumentar el tiempo. Tener en cuenta que a menos tiempo es mas probable que Whatsapp nos pueda banear el número y a más tiempo se demorará más en hacer envíos.
1. Ejecutar el archivo en `INSTALL_APP/install_front.bat` que instalará todas las dependencias del panel de envío de mensajes
1. Ejecutar el archivo en `INSTALL_APP/install_back.bat` que instalará todas las dependencias del servicio que permite el envío de mensajes por whatsapp en local
1. Ejecutar el archivo start_front.bat que correrá el proyecto en local en la dirección [http://localhost:4200](http://localhost:4200)
1. Ejecutar el archivo start_back.bat que correrá el proyecto en la dirección [http://localhost:3000](http://localhost:3000)

Nota: La primera vez que se inicie el proyecto de backend, se iniciará con el proceso de vinculación de whatsapp por lo que en la consola se desplegará un código QR que se debe escanear desde la opción "Vincular dispositivo" en la aplicación de Whatsapp. Luego, una carpeta con nombre `.wwebjs_auth` será creada y almacenará los datos de la sesión y mensajes. Todos los mensajes que se envíen serán en nombre de dicha cuenta.

La próxima vez que se inicie el backend ya no pedirá vincular el dispositivo ni mostará el codigo QR.

Si se requiere cerrar la sesión se puede hacer desde la aplicación de whatsapp y eliminando la carpeta `.wwebjs_auth` lo que activará nuevamente el proceso de autenticación (escaneo de código QR)

Una vez en la consola de backend (donde se mostró el codigo QR) se muestre el texto "Client is ready!" estará todo listo para enviar mensajes.

## Archivo CSV para envío masivo (solo teléfonos)

En la ruta `/home` se tiene la opción de envío masivo. Se debe escribir un mensaje, se tiene la opción de adjuntar un archivo, colocarle un texto "caption" al archivo, y adjuntar un archivo csv exportado con excel con el campo phone y números de teléfono separados por saltos de línea (valor por defecto de excel).

El formato de este archivo y de los números debe ser como el siguiente:

`<prefijo de pais sin signo de suma>` + `<número de telefono>`

Ej:

```
phone
51987654321
51234567891
```
Ejemplo de archivo:

![image](https://github.com/user-attachments/assets/311ec7c6-350a-47b9-8a66-c3a68085e2e6)


Una vez cargado el archivo, se debe presionar el botón enviar y se mostrará un mensaje de confirmación con el número total de contactos a los que se le enviará el mensaje. Al darle continuar el proceso se ejecuta y la unica forma de detenerlo es recargando la página.

## Archivo CSV para envío masivo (plantillas)

El sistema soporta el mapeo de variables presentes en el excel. Podemos definir diferentes columnas y asignar a cada fila sus valores correspondientes para que en tiempo de ejecución se reemplacen dichos valores.

Podemos lograr esto haciendo lo siguiente:

1. Aparte de la columna phone que es obligatoria, definir en un archivo de excel las otras columnas a utilizar. Los nombres de las columnas no deben tener caracteres extraños como tildes, ñ ni algun caracter especial (por ejemplo: `año`, `dirección`, `anio-seccion` no serían válidos)
2. Llenar por cada fila todos los datos
3. Guardar el csv como `CSV UTF-8` para que todos los caracteres sean exportados correctamente (para evitar problemas con emojis, el caracter `ñ` o tildes)
4. Escribimos el mensaje en la app web como lo haríamos normalmente pero usando el formato de interpolación que se describirá en el ejemplo
5. Se sugiere crear un archivo csv con uno o dos números de prueba a fin de verificar que los parametros estén mapeados de manera correcta.
6. En caso que el delimitador de campos sea diferente a `;` (por defecto) se puede configurar en el archivo `environment.ts`:

```
...
config:{
    sleepBetweenMessagesInMs: 3000,
    maxSizeMessage:65536,
    templateDelimiter: ";"
  },
...
```

Por ejemplo, digamos que queremos personalizar un mensaje por cada fila con el nombre y apellido de los contactos. Para hacerlo se siguen los pasos

#### Definir en un archivo de excel las otras columnas a utilizar

El excel en la primera fila colocamos las columnas necesarias, en este ejemplo son el número de teléfono (siempre debe ir), el nombre, el apellido y la palabra de bienvenida que variará según la persona:

![image](https://github.com/user-attachments/assets/fe0f8df3-74ed-4866-b7aa-94a43141caa0)


Al exportar el archivo csv tendríamos algo parecido a lo siguiente:

```
phone;name;lastname;welcomeword
51987654321;Pepito;Perez;bienvenido
51123456789;María;Sanchez;bienvenida
```
Como vemos el nombre María tiene tilde por lo que al exportar el archivo es siempre necesario hacerlo con formato `UTF-8` para que al momento de utilizarlo se visualicen todos los caracteres correctamente.

#### Escribir el mensaje en la app web
Con las variables definidas ahora tenemos que crear el mensaje en la app web, para referenciar las variables lo hacemos con el formato `{{nombre_variable}}`.

Por ejemplo queremos que el siguiente mensaje se personalice por fila:
```
Hola (NOMBRE) (APELLIDO) queremos que te sientas (BIENVENIDO/A) al evento
```
Lo escribiríamos en la app de esta manera:
```
Hola {{name}} {{lastname}} queremos que te sientas {{welcomeword}} al evento.
```
Lo que ocasionará que se envíen dos mensajes rellenados personalizados por cada fila
```
Hola Pepito Perez queremos que te sientas bienvenido al evento
Hola María Sanchez queremos que te sientas bienvenida al evento
```

Notas: 

- Las variables a utilizar siempre se leeran en minúsculas. Si se definen en el excel `Lastname` o `LASTNAME`, en el campo de mensaje en el app web se deben referenciar todo en minusculas `{{lastname}}`

- También si para cierta fila no está presente la variable que se quiere acceder simplemente se completará con un espacio vacío.

- Para el caso de links y otras variables con cadenas de caracteres que puedan contener caracteres especiales (como por ejemplo `/`) la librería por defecto los va a escapar. En estos casos, para que la libería no realice la conversión será necesario utilizar triple llaves en tu variable: `{{{url}}}`

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

Nota: En esta sección no se hacen mapeos de variables por lo que no se van a reemplazar.

## Envío de archivos
El app soporta adjuntar un archivo para que pueda ser compartido o bien con el mensaje o solo enviar el archivo a la lista de números especificados. Para ello solo es necesario marcar el checkbox "El mensaje lleva adjunto" lo que habilitará dos campos:

![image](https://github.com/user-attachments/assets/c9526129-3fd9-4a25-83bf-fb0fba573d5b)


1) Selector de archivo: para adjuntar el archivo a enviar. El archivo puede ser de cualquier extensión puesto que no está limitado en el html pero hay algunas limitaciones:
- El archivo debe ser menor a 10 MB
- Si bien permite elegir cualquier extensión no se ha podido probar con todos por lo que no se garantiza que los soporte a todos. Hasta el momento se probó con: Documentos de excel, word, pdf, imagenes, zip, exe, archivos de audio. Archivos de videos parece tener limitaciones.
- Los archivos de audio no permiten añadir titulo

2) Mensaje de titulo: un campo de texto opcional que se le anexará al archivo enviado aparte del mensaje principal que se envía primero. Este campo también admite mapeo de variables tal cual como se hace con el mensaje principal. Las mismas variables se utilizan en ambos sitios.

Por defecto está seleccionado el check de "incluir mensaje" y deseleccionado el check "El mensaje lleva adjunto".

Para enviar solo mensaje seleccionar el primer check y no el segundo. Para enviar mensaje y adjunto, seleccionar ambos checks. Para enviar solo archivo, seleccionar el segundo check y no el primero.

Importante tener en cuenta que el tiempo se duplica ya que entre mensajes demora por defecto 3000 ms (3 segundos) por lo que si se envía mensaje y adjunto se esperará entre cada uno 3 segundos por lo que por cada fila del excel demorará 6 segundos.

Si se quisiera cambiar esto (con el riesgo de que puedan banear la cuenta por lo rápido) se puede cambiar el tiempo en el archivo `src\environments\environment.ts`

## Logs
Cuando inicia el backend se genera un archivo de logs con hora y fecha actual que permite revisar a qué numeros se han enviado mensajes. También si el envío a uno de ellos fuera insatisfactorio se mostrará el mensaje en el log, dando la oportunidad de poder saber a qué números no llego el mensaje.

Un ejemplo de log:

```
Filename: backend/logs/log-20241018-123744.log

Log creado el: 20241018-123744
2024/10/18-12:38:56,-----------------------------Iniciando envío-----------------------------
2024/10/18-12:38:56,Sent,51123456789,
2024/10/18-12:38:56,Sent,51987654321,

```

Made with ❤ by Isaac Yriarte <<isaacyagi@gmail.com>>
