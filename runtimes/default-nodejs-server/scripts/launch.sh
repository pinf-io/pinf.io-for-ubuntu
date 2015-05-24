#!/bin/bash
export VERBOSE=1
# Source https://github.com/cadorn/bash.origin
. "%%BO_ROOT_SCRIPT_PATH%%"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	PGS_DIR="$___TMP___"


	BO_sourcePrototype "%%PIO_SERVICE_ACTIVATE_FILEPATH%%"

	BO_run_node "$PIO_SERVICE_LIVE_INSTALL_DIRPATH" >> "$PIO_SERVICE_LOG_BASEPATH".log 2>&1
}
init $@