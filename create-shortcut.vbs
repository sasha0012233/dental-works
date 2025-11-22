Set WshShell = CreateObject("WScript.Shell")
currentDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\") - 1)

' Создаем ярлык на рабочем столе
Set oShellLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & "\DentalWorks.lnk")
oShellLink.TargetPath = "cmd.exe"
oShellLink.Arguments = "/k """ & currentDir & "\start-server.bat"""
oShellLink.WindowStyle = 1
oShellLink.IconLocation = "cmd.exe, 0"
oShellLink.Description = "Запуск DentalWorks приложения"
oShellLink.WorkingDirectory = currentDir
oShellLink.Save

' Создаем ярлык в меню Пуск
Set oShellLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Programs") & "\DentalWorks.lnk")
oShellLink.TargetPath = "cmd.exe"
oShellLink.Arguments = "/k """ & currentDir & "\start-server.bat"""
oShellLink.WindowStyle = 1
oShellLink.IconLocation = "cmd.exe, 0"
oShellLink.Description = "Запуск DentalWorks приложения"
oShellLink.WorkingDirectory = currentDir
oShellLink.Save

MsgBox "Ярлыки для DentalWorks созданы на рабочем столе и в меню Пуск!", vbInformation, "DentalWorks"