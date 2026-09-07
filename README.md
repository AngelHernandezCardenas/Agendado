# Agendado

software de uso local para poner horarios y programar recordatorios de actividades cotidiantas

Agenda de estudio local para organizar bloques de JavaScript, Python, C++ y automatizacion.

## Ejecutar

Requiere Python 3 y Windows para los avisos nativos.

```powershell
python server.py
```

Abre http://127.0.0.1:8765 en el PC. Para abrirlo en el celular, conecta ambos dispositivos a la misma red Wi-Fi, ejecuta el servidor y sustituye `<IP-DE-ESTE-PC>` por la IPv4 del PC, por ejemplo `http://192.168.1.25:8765`. Puedes consultar la IPv4 con `ipconfig` y buscar `Direccion IPv4`. Si Windows Firewall pregunta, permite el acceso en redes privadas.

Mantener la pagina abierta permite consultar el horario y usar el boton de prueba de notificacion. Los bloques iniciales se guardan en el navegador; los nuevos bloques persisten en `localStorage`.

## Abrir sin VS Code

Haz doble clic en `iniciar_recordatorios.vbs`. El servidor se inicia oculto y la agenda se abre automaticamente en el navegador. Puedes crear un acceso directo de ese archivo en el escritorio o colocarlo en la carpeta de inicio de Windows para ejecutarlo al iniciar sesion.

Para detenerlo manualmente, cierra el proceso `python.exe` desde el Administrador de tareas o ejecuta `Get-Process python | Stop-Process` en PowerShell.

## Regla semanal

- Lunes, martes y miercoles: bloque de 6:00 a 7:00 a. m. y regreso a las 3:00 p. m.
- Jueves y viernes: sesiones por la tarde.
- Sabado: repaso ligero.
- Domingo: planificacion de la semana.

La interfaz se construye con JavaScript y CSS sin dependencias. `server.py` sirve los archivos y usa PowerShell para solicitar el aviso de Windows.
