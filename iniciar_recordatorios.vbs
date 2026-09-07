Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
appFolder = fso.GetParentFolderName(WScript.ScriptFullName)
pythonw = shell.ExpandEnvironmentStrings("%LocalAppData%\Programs\Python\Python311\pythonw.exe")
server = appFolder & "\server.py"

If Not fso.FileExists(pythonw) Then
  pythonw = "pythonw.exe"
End If

shell.CurrentDirectory = appFolder
shell.Run Chr(34) & pythonw & Chr(34) & " " & Chr(34) & server & Chr(34), 0, False
WScript.Sleep 1200
shell.Run "http://127.0.0.1:8765", 1, False