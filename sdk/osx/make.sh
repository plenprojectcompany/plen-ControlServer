#!/bin/bash

# author    : Yugo KAJIWARA
# author    : Kazuyuki TAKASE
# copyright : PLEN Project Company, and all authors.
# license   : The MIT License


cd ../../
REPOSITORY_ROOT=`pwd`
ICO_PATH="${REPOSITORY_ROOT}/control_server/assets/app.icns"
SETUP_SCRIPT_NAME=setup.py
PY_NAME=main
APP_NAME=ControlServer


# Run the packaging script.
# =============================================================================
cd "${REPOSITORY_ROOT}/sdk/osx/"
cp setup.py "${REPOSITORY_ROOT}/control_server/"

cd "${REPOSITORY_ROOT}/control_server/"
python ${SETUP_SCRIPT_NAME} py2app


# Setup up core components' files and directories.
# =============================================================================
cp config.json ./dist
cp device_map.json ./dist

cd ./dist
mkdir ${PY_NAME}.app/Contents/Resources/logs
mkdir ${PY_NAME}.app/Contents/Resources/views
cat << __URL_FILE_EOL__ > PLEN_Utils.url
[InternetShortcut]
URL=http://localhost:17264/
__URL_FILE_EOL__


# Tear down unnecessary files and directories.
# =============================================================================
cd ..
rm -rf build ${SETUP_SCRIPT_NAME}


# Set up GUI components' files and directories.
# =============================================================================
cd "${REPOSITORY_ROOT}/control_server_gui/control_server_gui/"
cp gui.html "${REPOSITORY_ROOT}/control_server/dist/${PY_NAME}.app/Contents/Resources/views/"
cp -r angularjs "${REPOSITORY_ROOT}/control_server/dist/${PY_NAME}.app/Contents/Resources/"
cp -r assets "${REPOSITORY_ROOT}/control_server/dist/${PY_NAME}.app/Contents/Resources/"


# Set up Gnecessary user's resource files.
# =============================================================================
cd "${REPOSITORY_ROOT}/control_server/"
cp config.json "dist/${PY_NAME}.app/Contents/Resources/"
cp device_map.json "dist/${PY_NAME}.app/Contents/Resources/"


# Clean up existing wrapped *.app.
# =============================================================================
cd "${REPOSITORY_ROOT}/control_server/dist/"
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
if app_path ends with "/" then
else
    app_path = app_path & "/"
end if

# Copy necessary user's resources into the resource directory.
# [WARNING!!!] This function can't work on macOS Sierra above due to App Translocation.
# -----------------------------------------------------------------------------
# do shell script "cp -f \"" & app_path & device_map_name & "\" \"" & resource_path & device_map_name & "\""
# do shell script "cp -f \"" & app_path & config_name & "\" \"" & resource_path & config_name & "\""

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


# Create the app's icon.
# =============================================================================
cp -f ${ICO_PATH} "${APP_NAME}.app/Contents/Resources/applet.icns"


# Move *.app to wrapped *.app's resource directory.
# =============================================================================
mv -f ${PY_NAME}.app "${APP_NAME}.app/Contents/Resources/${PY_NAME}.app"


# Rename the packaged application with version number.
# =============================================================================
cd "${REPOSITORY_ROOT}/control_server/"
APP_VERSION=`git tag | tail -n1`
mv dist ControlServer_OSX_${APP_VERSION}


# Show the prompt message.
# =============================================================================
echo -e "\nPlease enter any key to exit..."
read WAIT
