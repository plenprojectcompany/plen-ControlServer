#!/bin/bash

# author    : Yugo KAJIWARA
# author    : Kazuyuki TAKASE
# copyright : PLEN Project Company, and all authors.
# license   : The MIT License


# Check command-line option(s) length.
# =============================================================================
if [ $# -ne 2 ]; then
    echo "Usage : ./make.sh <src> <out>"
    echo "<src> : Please input source \"*.py\" name."
    echo "<out> : Please input output \"*.app\" name."

    exit 1
fi


# Check existing the python script which will be *.app.
# =============================================================================
if [ ! -e $1 ]; then
    echo "Error : \"$1\" does not exist!"

    exit 1
fi 


# Convert application entry point's *.py into *.app.
# =============================================================================
if [ -e "setup.py" ]; then
    rm -f setup.py
fi

py2applet --make-setup $1
python setup.py py2app --dist-dir ./


# Check that converting *.app was succeeded.
# =============================================================================
input_without_ext=`basename ${1} .py`

if [ ! -e "${input_without_ext}.app" ]; then
    echo "Error : Building \"$2\" is failed!"

    exit 1
fi


# Set *.app name.（If it equals final output *.app, rename it to a temporary name.）
# =============================================================================
app_name="${input_without_ext}.app"

if [ $app_name = $2 ]; then
    app_name="${input_without_ext}_py.app"
    mv -f "${input_without_ext}.app" ${app_name}
fi


# Clean up existing wrapped *.app.
# =============================================================================
if [ -e $2 ]; then
    rm -rf $2
fi


# Create wrapped *.app.
# =============================================================================
osacompile -o $2 <<__APPLE_SCRIPT__
# Startup process.
# -----------------------------------------------------------------------------
set server_path to (POSIX path of (path to resource "${app_name}/Contents/MacOS/${input_without_ext}")) as string
set resource_path to (POSIX path of (path to resource "${app_name}/Contents/Resources")) as string
set device_map_name to "device_map.json"
set config_name to "config.json"


# Create *.app's parent directory path.
# -----------------------------------------------------------------------------
tell application "Finder" to set this_folder to parent of (path to me) as string
set app_path to POSIX path of this_folder


# Copy necessary user's resources into the resource directory.
# -----------------------------------------------------------------------------
do shell script "cp -f " & app_path & device_map_name & " " & resource_path & device_map_name
do shell script "cp -f " & app_path & config_name & " " & resource_path & config_name


# Run the "Terminal"
# -----------------------------------------------------------------------------
tell application "Terminal"
    activate

    # Run the actual *.app. (by running as a background process, wrapped *.app is finished when start the actual *.app.)
    do script (server_path)
end tell
__APPLE_SCRIPT__

if [ ! -e $2 ]; then
    echo "Error : Making wrapped *.app is failed!"

    exit 1
fi


# Move *.app to wrapped *.app's resource directory.
# =============================================================================
mv -f $app_name "$2/Contents/Resources/${app_name}"

exit 0