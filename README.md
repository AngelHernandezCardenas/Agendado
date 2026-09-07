# Agendado

software de uso local para poner horarios y programar recordatorios de actividades cotidiantas

Agenda de estudio local para organizar bloques de JavaScript, Python, C++ y automatizacion.

## Ejecutar

Requiere Python 3. En Windows, PowerShell permite los avisos nativos; en Linux, la agenda y las notificaciones del navegador funcionan de forma multiplataforma.

```powershell
python backend/server.py
```

Abre http://127.0.0.1:8765 en el PC. Para abrirlo en el celular, conecta ambos dispositivos a la misma red Wi-Fi, ejecuta el servidor y sustituye `<IP-DE-ESTE-PC>` por la IPv4 del PC, por ejemplo `http://192.168.1.25:8765`. Puedes consultar la IPv4 con `ipconfig` y buscar `Direccion IPv4`. Si Windows Firewall pregunta, permite el acceso en redes privadas.

Mantener la pagina abierta permite consultar el horario y recibir notificaciones en tiempo real. Pulsa "Permitir avisos" y acepta el permiso del navegador. Los bloques iniciales se guardan en el navegador; los nuevos bloques persisten en `localStorage`.

## Abrir sin VS Code

Haz doble clic en `iniciar_recordatorios.vbs`. El servidor se inicia oculto y la agenda se abre automaticamente en el navegador. Puedes crear un acceso directo de ese archivo en el escritorio o colocarlo en la carpeta de inicio de Windows para ejecutarlo al iniciar sesion.

Para detenerlo manualmente, cierra el proceso `python.exe` desde el Administrador de tareas o ejecuta `Get-Process python | Stop-Process` en PowerShell.

## Regla semanal

- Lunes, martes y miercoles: bloque de 6:00 a 7:00 a. m. y regreso a las 3:00 p. m.
- Jueves y viernes: sesiones por la tarde.
- Sabado: repaso ligero.
- Domingo: planificacion de la semana.

La interfaz se construye con JavaScript y CSS sin dependencias. `backend/server.py` sirve los archivos de `frontend/` y usa PowerShell para solicitar el aviso de Windows cuando se ejecuta en Windows.

## Empaquetado para Windows y Linux

El ejecutable de Windows se encuentra en `dist/Agendado.exe`. Al abrirlo, inicia el servidor local y abre Agendado automáticamente; no necesita el puerto público ni el enlace de Dev Tunnel. El ejecutable debe construirse en el mismo sistema operativo donde se va a utilizar; un `.exe` de Windows no funciona en Linux.

```powershell
python -m pip install -r requirements-packaging.txt
python -m PyInstaller packaging/agendado.spec
```

En Windows, el resultado será `dist/Agendado.exe`. En Linux, ejecuta los mismos comandos desde Linux y se generará `dist/Agendado`, que podrá ejecutarse en otros equipos Linux compatibles sin instalar Python. La configuración incluye automáticamente `frontend/` dentro del ejecutable.

---

## English

# Agendado

Local-use software for scheduling times and programming reminders for everyday activities.

A local study planner for organizing JavaScript, Python, C++, and automation sessions.

### Running

Requires Python 3 and Windows for native notifications.

```powershell
python backend/server.py
```

Open http://127.0.0.1:8765 on the PC. To open it on a phone, connect both devices to the same Wi-Fi network, run the server, and replace `<IP-OF-THIS-PC>` with the PC's IPv4 address, for example `http://192.168.1.25:8765`. You can find the IPv4 address by running `ipconfig` and looking for `IPv4 Address`. If Windows Firewall asks, allow access on private networks.

Keep the page open to view the schedule and receive real-time notifications. Click "Permitir avisos" and accept the browser permission. The initial sessions are saved in the browser; new sessions persist in `localStorage`.

### Opening Without VS Code

Double-click `iniciar_recordatorios.vbs`. The server starts hidden and the planner opens automatically in the browser. You can create a shortcut to this file on the desktop or place it in the Windows startup folder to run it when you sign in.

To stop it manually, close the `python.exe` process from Task Manager or run `Get-Process python | Stop-Process` in PowerShell.

### Weekly Schedule

- Monday, Tuesday, and Wednesday: session from 6:00 to 7:00 a.m. and return at 3:00 p.m.
- Thursday and Friday: afternoon sessions.
- Saturday: light review.
- Sunday: plan the week.

The interface is built with JavaScript and CSS without dependencies. `server.py` serves the files and uses PowerShell to request the Windows notification.

---

## Français

# Agendado

Logiciel à usage local pour planifier des horaires et programmer des rappels pour les activités quotidiennes.

Agenda d'étude local pour organiser des sessions de JavaScript, Python, C++ et automatisation.

### Exécution

Python 3 et Windows sont requis pour les notifications natives.

```powershell
python backend/server.py
```

Ouvrez http://127.0.0.1:8765 sur le PC. Pour l'ouvrir sur un téléphone, connectez les deux appareils au même réseau Wi-Fi, démarrez le serveur et remplacez `<IP-DE-CE-PC>` par l'adresse IPv4 du PC, par exemple `http://192.168.1.25:8765`. Vous pouvez trouver l'adresse IPv4 en exécutant `ipconfig` et en recherchant `Adresse IPv4`. Si le pare-feu Windows le demande, autorisez l'accès sur les réseaux privés.

Laissez la page ouverte pour consulter l'emploi du temps et recevoir des notifications en temps réel. Cliquez sur « Permitir avisos » et acceptez l'autorisation du navigateur. Les sessions initiales sont enregistrées dans le navigateur ; les nouvelles sessions sont conservées dans `localStorage`.

### Ouverture sans VS Code

Double-cliquez sur `iniciar_recordatorios.vbs`. Le serveur démarre en arrière-plan et l'agenda s'ouvre automatiquement dans le navigateur. Vous pouvez créer un raccourci vers ce fichier sur le bureau ou le placer dans le dossier de démarrage de Windows pour l'exécuter lors de la connexion.

Pour l'arrêter manuellement, fermez le processus `python.exe` depuis le Gestionnaire des tâches ou exécutez `Get-Process python | Stop-Process` dans PowerShell.

### Planning hebdomadaire

- Lundi, mardi et mercredi : session de 6 h 00 à 7 h 00 et reprise à 15 h 00.
- Jeudi et vendredi : sessions l'après-midi.
- Samedi : révision légère.
- Dimanche : planification de la semaine.

L'interface est construite avec JavaScript et CSS sans dépendances. `server.py` sert les fichiers et utilise PowerShell pour demander la notification Windows.

---

## Deutsch

# Agendado

Lokale Software zum Festlegen von Zeitplänen und Programmieren von Erinnerungen für alltägliche Aktivitäten.

Lokaler Lernplaner zum Organisieren von JavaScript-, Python-, C++- und Automatisierungseinheiten.

### Ausführung

Für native Benachrichtigungen werden Python 3 und Windows benötigt.

```powershell
python backend/server.py
```

Öffne http://127.0.0.1:8765 auf dem PC. Um die Anwendung auf einem Smartphone zu öffnen, verbinde beide Geräte mit demselben WLAN, starte den Server und ersetze `<IP-DIESES-PC>` durch die IPv4-Adresse des PCs, zum Beispiel `http://192.168.1.25:8765`. Die IPv4-Adresse findest du mit `ipconfig` unter `IPv4-Adresse`. Wenn die Windows-Firewall fragt, erlaube den Zugriff in privaten Netzwerken.

Lass die Seite geöffnet, um den Zeitplan anzuzeigen und Echtzeitbenachrichtigungen zu erhalten. Klicke auf „Permitir avisos“ und erlaube die Browser-Berechtigung. Die voreingestellten Einheiten werden im Browser gespeichert; neue Einheiten bleiben in `localStorage` erhalten.

### Öffnen ohne VS Code

Doppelklicke auf `iniciar_recordatorios.vbs`. Der Server wird ausgeblendet gestartet und der Planer öffnet sich automatisch im Browser. Du kannst eine Verknüpfung zu dieser Datei auf dem Desktop erstellen oder sie in den Windows-Autostartordner legen, damit sie beim Anmelden ausgeführt wird.

Um den Server manuell zu beenden, schließe den Prozess `python.exe` über den Task-Manager oder führe `Get-Process python | Stop-Process` in PowerShell aus.

### Wochenplan

- Montag, Dienstag und Mittwoch: Einheit von 6:00 bis 7:00 Uhr und Fortsetzung um 15:00 Uhr.
- Donnerstag und Freitag: Nachmittagseinheiten.
- Samstag: leichte Wiederholung.
- Sonntag: die Woche planen.

Die Oberfläche wird ohne Abhängigkeiten mit JavaScript und CSS erstellt. `server.py` stellt die Dateien bereit und verwendet PowerShell, um die Windows-Benachrichtigung anzufordern.
