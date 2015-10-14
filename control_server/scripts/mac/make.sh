#!/bin/bash
# author : Yugo KAJIWARA

# 引数の数をチェック
if [ $# -ne 2 ]; then
	echo "arg 1 : source \".py\" name"
	echo "arg 2 : output \".app\" name"
	exit 1
fi

# app化するpythonが存在するかチェック
if [ ! -e $1 ]; then
	echo "$1 does not exist."
	exit 1
fi 

# pyファイルをapp化
if [ -e "setup.py" ]; then
	rm -f setup.py
fi
py2applet --make-setup $1
python setup.py py2app --dist-dir ./

# app化に成功したかチェック
withoutExtName=`basename ${1} .py`
if [ ! -e "${withoutExtName}.app" ]; then
	echo "build error"
	exit 1
fi

# app名をセット（最終出力app名とかぶっている場合リネーム）
appName="${withoutExtName}.app"
if [ $appName = $2 ]; then
	appName="${withoutExtName}_py.app"
	mv -f "${withoutExtName}.app" ${appName}
fi

##### ここから作成したappをCUI実行できるようにwrapするapp（wrap_appとする）を作成する #####
# すでにwrap_appが存在する場合削除
if [ -e $2 ]; then
	rm -rf $2
fi

#wrap_appを作成
osacompile -o $2 <<__APPLESCRIPT__
## ここからApplescript ##
# パスを作成
set server_path to (POSIX path of (path to resource "${appName}/Contents/MacOS/${withoutExtName}")) as string
set resource_path to (POSIX path of (path to resource "${appName}/Contents/Resources")) as string
set device_map_name to "device_map.json"
# appの親フォルダのパスを作成
tell application "Finder" to set this_folder to parent of (path to me) as string
set app_path to POSIX path of this_folder
#device_map.jsonをserver本体のリソースフォルダへ保存
do shell script "cp -f " & app_path & device_map_name & " " & resource_path & device_map_name
# Terminal起動
tell application "Terminal"
	activate
	# appを実行（backgroundで実行することでapp起動後wrap_appが終了するようになる）
	do script (server_path & " --driver usb &")
end tell
## ここまでApplescript ##
__APPLESCRIPT__

if [ ! -e $2 ]; then
	echo "make wrap-app failed."
	exit 1
fi

# 実行appをwrap_appのリソースフォルダへ移動
mv -f $appName "$2/Contents/Resources/${appName}"

exit 0