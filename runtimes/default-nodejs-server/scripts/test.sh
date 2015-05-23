#!/bin/bash
# Source https://github.com/cadorn/bash.origin
if [ -z "$BO_ROOT_SCRIPT_PATH" ]; then . "$HOME/.bash.origin"; else . "$BO_ROOT_SCRIPT_PATH"; fi
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	PGS_DIR="$___TMP___"


	. "$PIO_BIN_DIRPATH/activate"


	URL="http://127.0.0.1:$PORT/"

	echo "URL: $URL"

	STATUS_CODE=$(curl -w %{http_code} -s --output /dev/null $URL)

	echo "STATUS_CODE: $STATUS_CODE"

	if [ $STATUS_CODE != 200 ]; then
		echo "Did not get 200!";
		echo '<wf name="result">{"success": false}</wf>'
		exit 1;
	fi

	echo '<wf name="result">{"success": true}</wf>'

	exit 0;

}
init $@
