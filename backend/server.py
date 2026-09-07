import json
import subprocess
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PROJECT_ROOT = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parents[1]))
ROOT = PROJECT_ROOT / "frontend"


def send_windows_notification(title: str, message: str) -> bool:
    """Uses the Windows toast bridge available through PowerShell."""
    safe_title = json.dumps(title)
    safe_message = json.dumps(message)
    script = (
        "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]"
        "; $template = [Windows.UI.Notifications.ToastTemplateType]::ToastText02"
        "; $xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent($template)"
        f"; $xml.GetElementsByTagName('text')[0].AppendChild($xml.CreateTextNode({safe_title}))"
        f"; $xml.GetElementsByTagName('text')[1].AppendChild($xml.CreateTextNode({safe_message}))"
        "; $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)"
        "; [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Agendado').Show($toast)"
    )
    try:
        result = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
            capture_output=True,
            text=True,
            timeout=8,
            check=False,
        )
        return result.returncode == 0
    except (OSError, subprocess.SubprocessError):
        return False


class AppHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/health":
            self.send_json({"ok": True, "notifications": "windows-toast"})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/notify":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(length) or b"{}")
            title = str(payload.get("title", "Agendado"))[:80]
            message = str(payload.get("message", "Tu próximo bloque de estudio te espera."))[:240]
            delivered = send_windows_notification(title, message)
            self.send_json({"ok": delivered, "message": "Aviso procesado"})
        except (ValueError, json.JSONDecodeError):
            self.send_error(400, "JSON invalido")

    def send_json(self, payload):
        content = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


if __name__ == "__main__":
    port = 8765
    server = ThreadingHTTPServer(("127.0.0.1", port), lambda *args: AppHandler(*args, directory=str(ROOT)))
    print(f"Agendado listo en http://127.0.0.1:{port}")
    print(f"En el celular, abre http://<IP-DE-ESTE-PC>:{port} conectado a la misma red Wi-Fi.")
    print("Pulsa Ctrl+C para detenerlo.")
    threading.Timer(0.8, lambda: webbrowser.open(f"http://127.0.0.1:{port}")).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()