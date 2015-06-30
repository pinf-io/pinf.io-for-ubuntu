#!/bin/bash
# Source https://github.com/cadorn/bash.origin
if [ -z "$BO_ROOT_SCRIPT_PATH" ]; then . "$HOME/.bash.origin"; else . "$BO_ROOT_SCRIPT_PATH"; fi
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	PGS_DIR="$___TMP___"

	. "$PIO_BIN_DIRPATH/activate"


	function installWithPlainNpm {
		BO_log "$VERBOSE" "Installing with npm in: $(pwd)"
		BO_run_npm install --production --unsafe-perm
		if [ $? -ne 0 ]; then { echo "Failed, aborting." ; exit 1; } fi
	}

	if BO_has smi-for-npm; then
		if [[ "$(pwd)" == *"/smi-for-npm/"* ]]; then
			installWithPlainNpm
		else
			BO_log "$VERBOSE" "Installing with smi-for-npm in: $(pwd)"
			smi-for-npm install --production --unsafe-perm
			if [ $? -ne 0 ]; then { echo "Failed, aborting." ; exit 1; } fi
		fi
	else
		installWithPlainNpm
	fi
}
init $@