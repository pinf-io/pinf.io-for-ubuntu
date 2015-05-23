#!/bin/bash
# Source https://github.com/cadorn/bash.origin
. "%%BO_ROOT_SCRIPT_PATH%%"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	PGS_DIR="$___TMP___"


	. "%%PIO_BIN_DIRPATH%%/activate"


echo "LAUNCH NODEJS-SERVER!"

	BO_run_node --version

echo "^ nore version"

#	export PATH='$PATH'
#	export PORT='$PORT'
#	'$PIO_SERVICE_PATH'/packages/node/bin/node '$PIO_SERVICE_PATH'/live/install/server.js >> '$PIO_SERVICE_LOG_BASE_PATH'.log 2>&1 

}
init $@