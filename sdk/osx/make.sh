#!/bin/bash

# author    : Yugo KAJIWARA
# author    : Kazuyuki TAKASE
# copyright : PLEN Project Company, and all authors.
# license   : The MIT License

ICO_PATH=assets/app.icns
SETUP_PY_PATH=setup.py
PY_NAME=main
APP_NAME=server

python ${SETUP_PY_PATH} "py2app"

# Clean up existing wrapped *.app.
# =============================================================================
if [ -e ${APP_NAME}.app ]; then
    rm -rf ${APP_NAME}.app
    fi


# Create wrapped *.app.
# =============================================================================
osacompile -o ${APP_NAME}.app <<__APPLE_SCRIPT__
# Startup process.
# -----------------------------------------------------------------------------
set server_path to (POSIX path of (path to resource "${PY_NAME}.app/Contents/MacOS/${PY_NAME}")) as string
set resource_path to (POSIX path of (path to resource "${PY_NAME}.app/Contents/Resources")) as string
set device_map_name to "device_map.json"
set config_name to "config.json"

# Create *.app's parent directory path.
# -----------------------------------------------------------------------------
tell application "Finder" to set this_folder to parent of (path to me) as string
set app_path to POSIX path of this_folder

# Copy necessary user's resources into the resource directory.
# -----------------------------------------------------------------------------
do shell script "cp -f \"" & app_path & device_map_name & "\" \"" & resource_path & device_map_name & "\""
do shell script "cp -f \"" & app_path & config_name & "\" \"" & resource_path & config_name & "\""

# Run the "Terminal"
# -----------------------------------------------------------------------------
tell application "Terminal"
    activate

    # Run the actual *.app. (by running as a background process, wrapped *.app is finished when start the actual *.app.)
    do script ("\"" & server_path & "\"")
end tell
__APPLE_SCRIPT__

if [ ! -e $2 ]; then
    echo "Error : Making wrapped *.app is failed!"

    exit 1
fi

# Create a Logs Directory
# =============================================================================
mkdir ${PY_NAME}.app/Contents/Resources/Logs

# Create the app's icon
# =============================================================================
cp -f ${ICO_PATH} "${APP_NAME}.app/Contents/Resources/applet.icns"

# Move *.app to wrapped *.app's resource directory.
# =============================================================================
mv -f ${PY_NAME}.app "${APP_NAME}.app/Contents/Resources/${PY_NAME}.app"

exit 0
