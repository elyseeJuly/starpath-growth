(*
StarPath 启动脚本
双击此脚本即可启动系统
*)

-- 获取脚本所在目录
tell application "Finder"
    set scriptPath to path to me
    set projectPath to (container of scriptPath) as text
end tell

-- 转换为 POSIX 路径
set posixPath to POSIX path of projectPath

-- 显示启动通知
display notification "正在启动 StarPath..." with title "StarPath" sound name "Glass"

-- 构建启动命令
set shellScript to "cd '" & posixPath & "' && ./start_starpath.sh"

-- 打开终端并执行
tell application "Terminal"
    activate
    do script shellScript
end tell

-- 等待一下然后打开浏览器
delay 8
tell application "Safari"
    activate
    open location "http://localhost:3000"
end tell
