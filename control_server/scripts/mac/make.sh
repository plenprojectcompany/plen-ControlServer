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

# リソースファイルに追加するファイル用の設定コマンド生成
dirPath=$(cd $(dirname $1) && pwd)
resources="${dirPath}/angularjs,${dirPath}/assets,${dirPath}/gui.html,${dirPath}/PLENUtilities.url,${dirPath}/PLENUtilities.webloc"

# pyファイルをapp化
if [ -e "setup.py" ]; then
	rm -f setup.py
fi
py2applet --make-setup $1
python setup.py py2app --dist-dir ./ --packages gevent --resources ${resources}

# app化に成功したかチェック
withoutExtName=`basename ${1} .py`
if [ ! -e "${withoutExtName}.app" ]; then
	echo "build error"
	exit 1
fi
# app名をセット（最終出力app名とかぶっている場合リネーム）
appName="${withoutExtName}.app"
if [ $appName = `basename ${2}` ]; then
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
# choose USB or BLE
set driverResult to (choose from list {"USB", "BLE"} with prompt "Please choose driver.\r\r ( Please choose \"USB\" if you want to use \"PLENUtillities\". )" default items "USB")
if driverResult is false then
	return
else if driverResult is equal to {"USB"} then
	set argv to "-d usb"
else
	set argv to "-d ble"
	# get PLEN_MAC_Address
	set macAddr to text returned of (display dialog "Please enter the PLEN MAC address. \r(e.g. \"11:2a:3b:4c:5d:6e\")\r\r (Please do not enter anything if you don't need MAC-address-filtering.)" default answer "")
	if macAddr is false then
		return
	else if macAddr is not equal to "" then
		set argv to argv & " --mac " & macAddr
	end if
end if
# Terminal起動
tell application "Terminal"
	activate
	# appを実行（backgroundで実行することでapp起動後wrap_appが終了するようになる）
	do script (server_path & " " & argv)
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