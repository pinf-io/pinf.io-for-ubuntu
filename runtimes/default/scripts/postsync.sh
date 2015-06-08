#!/bin/bash
# Source https://github.com/cadorn/bash.origin
if [ -z "$BO_ROOT_SCRIPT_PATH" ]; then . "$HOME/.bash.origin"; else . "$BO_ROOT_SCRIPT_PATH"; fi
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	PGS_DIR="$___TMP___"

	. "$PIO_BIN_DIRPATH/activate"




	BO_format "$VERBOSE" "HEADER" "Running 'postsync.sh' for: $PIO_SERVICE_HOME"

	local PIO_SYNC_SIZE_CHECKSUM=`sha256sum "$PIO_SERVICE_HOME/sync/.smg.form.json" | awk '{ print $1 }'`
	BO_log "$VERBOSE" "Sync checksum: $PIO_SYNC_SIZE_CHECKSUM"

	# TODO: Capture mtime in MTIME_CHECKSUM


	pushd "$PIO_SERVICE_HOME" > /dev/null

		CONFIGURED_DIR="configured/$PIO_SYNC_SIZE_CHECKSUM"

		function configure {
			if [ -e "configured/$PIO_SYNC_SIZE_CHECKSUM" ]; then
				if [ "$PIO_SKIP_PIO_SYNC_SIZE_CHECKSUM_CACHE" == "1" ]; then
					BO_log "$VERBOSE" "Removing 'configured/$PIO_SYNC_SIZE_CHECKSUM' due to 'PIO_SKIP_PIO_SYNC_SIZE_CHECKSUM_CACHE'"
					rm -Rf "configured/$PIO_SYNC_SIZE_CHECKSUM"
				else
					BO_log "$VERBOSE" "Skip configuring as already exists: $PIO_SERVICE_HOME/configured/$PIO_SYNC_SIZE_CHECKSUM"
					return 0
				fi
			fi

			BO_log "$VERBOSE" "Configuring: $PIO_SERVICE_HOME/configured/$PIO_SYNC_SIZE_CHECKSUM"

			if [ ! -e "configured" ]; then
				mkdir "configured"
			fi

			local WORKING_CONFIGURED_DIR="$CONFIGURED_DIR~$(date +%s%N)"

			cp -Rf "sync" "$WORKING_CONFIGURED_DIR"

			cp -Rf "sync/source" "$WORKING_CONFIGURED_DIR/install"
			pushd "$WORKING_CONFIGURED_DIR/install" > /dev/null
				BO_sourcePrototype "$PGS_DIR/build.nodejs.sh"
			popd > /dev/null

			BO_log "$VERBOSE" "Configure of '$PIO_SERVICE_HOME/$WORKING_CONFIGURED_DIR' done. Now activating by moving to '$CONFIGURED_DIR'"
			mv "$WORKING_CONFIGURED_DIR" "$CONFIGURED_DIR"
		}

		function activate {
			BO_log "$VERBOSE" "Taking live: $PIO_SERVICE_HOME/$CONFIGURED_DIR"

			rm -f "live" > /dev/null || true
			ln -s "$CONFIGURED_DIR" "live"

			rm -f "$PIO_HOME/node_modules/$PIO_SERVICE_ID" > /dev/null || true
			ln -s "$PIO_SERVICE_LIVE_INSTALL_DIRPATH" "$PIO_HOME/node_modules/$PIO_SERVICE_ID"
		}

		configure
		activate

	popd > /dev/null


	# Let the NodeJS (or equivalent) implementation do the work if it is available
	# instead of doing the minimal configuring below.
	if hash io-pinf-pio-postsync 2>/dev/null; then
		if [ "$PIO_SERVICE_ID" != "io.pinf.pio.postsync" ]; then
			pushd "$PIO_SERVICE_HOME" > /dev/null
				io-pinf-pio-postsync
			popd > /dev/null
			return 0
		fi
	fi


	BO_format "$VERBOSE" "FOOTER"
}
init $@