
require('org.pinf.genesis.lib/lib/api').forModule(require, module, function (API, exports) {

	exports.resolveSystemENV = function (env) {

        env.PIO_HOME = env.PIO_HOME || "$HOME/io.pinf";
    	env.PIO_BIN_DIRPATH = env.PIO_BIN_DIRPATH || (env.PIO_HOME + "/bin");
        env.PATH = env.PATH || (env.PIO_BIN_DIRPATH + ':$PATH');
        env.PIO_CACHE_DIRPATH = env.PIO_CACHE_DIRPATH || (env.PIO_HOME + "/cache");
        env.PIO_LOG_DIRPATH = env.PIO_LOG_DIRPATH || (env.PIO_HOME + "/log");
    	env.PIO_RUN_DIRPATH = env.PIO_RUN_DIRPATH || (env.PIO_HOME + "/run");
    	env.PIO_DATA_DIRPATH = env.PIO_DATA_DIRPATH || (env.PIO_HOME + "/data");

    	env.PIO_SERVICES_DIRPATH = env.PIO_SERVICES_DIRPATH || (env.PIO_HOME + "/services");

        env.SMI_CACHE_DIRPATH = env.SMI_CACHE_DIRPATH || (env.PIO_CACHE_DIRPATH + "/github.com~sourcemint~smi~0/cache");

        env.BO_PACKAGES_DIR = env.BO_PACKAGES_DIR || env.PIO_CACHE_DIRPATH;
        env.BO_SYSTEM_CACHE_DIR = env.BO_SYSTEM_CACHE_DIR || env.PIO_CACHE_DIRPATH;
        env.BO_ROOT_SCRIPT_PATH = env.BO_ROOT_SCRIPT_PATH || (env.PIO_BIN_DIRPATH + "/bash.origin");
	}

	exports.generateSystemPrerequisiteCommands = function (options) {

		API.ASSERT(typeof options.sshUser, "string");
		API.ASSERT(typeof options.env, "object");

		var commands = [
            // Make sure default install directory exists
            'if [ ! -d ' + options.env.PIO_HOME + ' ]; then mkdir -p ' + options.env.PIO_HOME + '; fi',

            // Make sure some default directories exist
            'if [ ! -d ' + options.env.PIO_BIN_DIRPATH + ' ]; then mkdir ' + options.env.PIO_BIN_DIRPATH + '; fi',
            'if [ ! -d ' + options.env.PIO_CACHE_DIRPATH + ' ]; then mkdir ' + options.env.PIO_CACHE_DIRPATH + '; fi',
            'if [ ! -d ' + options.env.PIO_DATA_DIRPATH + ' ]; then mkdir ' + options.env.PIO_DATA_DIRPATH + '; fi',
            'if [ ! -d ' + options.env.PIO_HOME + '/tmp ]; then mkdir ' + options.env.PIO_HOME + '/tmp; fi',
            'if [ ! -d ' + options.env.PIO_LOG_DIRPATH + ' ]; then mkdir ' + options.env.PIO_LOG_DIRPATH + '; fi',
            'if [ ! -d ' + options.env.PIO_RUN_DIRPATH + ' ]; then mkdir ' + options.env.PIO_RUN_DIRPATH + '; fi',

            'if [ ! -d ' + options.env.PIO_SERVICES_DIRPATH + ' ]; then mkdir ' + options.env.PIO_SERVICES_DIRPATH + '; fi',
            'if [ ! -d ' + options.env.PIO_HOME + '/node_modules ]; then mkdir ' + options.env.PIO_HOME + '/node_modules; fi',

            // pinf.io activation file
            'if [ ! -f "' + options.env.PIO_BIN_DIRPATH + '/activate" ]; then',
            '  echo "#!/bin/sh -e\n' + Object.keys(env).map(function (name) {
                return 'export ' + name + '=' + env[name];
            }).join("\n").replace(/"/g, "\\\"") + '" > ' + options.env.PIO_BIN_DIRPATH + '/activate',
            'fi'
        ];

        // init pinf.io env for all terminal sessions
        if (options.sshUser === "root") {
        	commands = commands.concat([
				'if [ ! -f "/etc/profile.d/io.pinf.pio.sh" ]; then',
	            '  echo ". ' + options.env.PIO_BIN_DIRPATH + '/activate" > /etc/profile.d/io.pinf.pio.sh',
	            'fi'
	        ]);
        } else {
        	commands = commands.concat([
				'if [ ! -f "/etc/profile.d/io.pinf.pio.sh" ]; then',
	            '  sudo touch /etc/profile.d/io.pinf.pio.sh',
	            '  sudo chown -f ' + options.sshUser + ':' + options.sshUser + ' /etc/profile.d/io.pinf.pio.sh',
	            '  echo ". ' + options.env.PIO_BIN_DIRPATH + '/activate" > /etc/profile.d/io.pinf.pio.sh',
	            '  sudo chown root:root /etc/profile.d/io.pinf.pio.sh',
	            'fi'
			]);
        }

        return commands;

    	/*
    	// Use when installing globally in say '/opt/' using username other than root.
        // Make sure default install directory exists and is writable by our user.
        'if [ ! -d "' + options.env.PIO_HOME + '" ]; then sudo mkdir -p "' + options.env.PIO_HOME + '"; fi',
        "sudo chown -f " + resolvedConfig.ssh.user + ":" + resolvedConfig.ssh.user + " " + options.env.PIO_HOME,
        // Make sure some default directories exist
        'if [ ! -d "' + options.env.PIO_HOME + '/bin" ]; then mkdir "' + options.env.PIO_HOME + '/bin"; fi',
        'if [ ! -d "' + options.env.PIO_HOME + '/cache" ]; then mkdir "' + options.env.PIO_HOME + '/cache"; fi',
        'if [ ! -d "' + options.env.PIO_HOME + '/data" ]; then mkdir "' + options.env.PIO_HOME + '/data"; fi',
        'if [ ! -d "' + options.env.PIO_HOME + '/tmp" ]; then mkdir "' + options.env.PIO_HOME + '/tmp"; fi',
        'if [ ! -d "' + options.env.PIO_HOME + '/log" ]; then mkdir "' + options.env.PIO_HOME + '/log"; fi',
        'if [ ! -d "' + options.env.PIO_HOME + '/run" ]; then mkdir "' + options.env.PIO_HOME + '/run"; fi',
        'if [ ! -d "' + options.env.PIO_HOME + '/services" ]; then mkdir "' + options.env.PIO_HOME + '/services"; fi',
        // Put `<prefix>/bin` onto system-wide PATH.
        'if [ ! -f "/etc/profile.d/io.pinf.sh" ]; then',
        '  sudo touch "/etc/profile.d/io.pinf.sh"',
        "  sudo chown -f " + resolvedConfig.ssh.user + ":" + resolvedConfig.ssh.user + " /etc/profile.d/io.pinf.sh",
        // TODO: Get `pio._config.env.PATH` from `state["pio"].env`.
        '  echo "source \"' + options.env.PIO_HOME + '/bin/activate\"" > /etc/profile.d/io.pinf.sh',
        '  sudo chown root:root "/etc/profile.d/io.pinf.sh"',
        'fi',
        'if [ ! -f "' + options.env.PIO_HOME + '/bin/activate" ]; then',
        '  echo "#!/bin/sh -e\nexport PATH=' + options.env.PIO_HOME + '/bin:$PATH\n" > ' + options.env.PIO_HOME + '/bin/activate',
        "  sudo chown -f " + resolvedConfig.ssh.user + ":" + resolvedConfig.ssh.user + " " + options.env.PIO_HOME + '/bin/activate',
        'fi',
        "sudo chown -f " + resolvedConfig.ssh.user + ":" + resolvedConfig.ssh.user + " " + options.env.PIO_HOME + '/*',
        // NOTE: When deploying as root we need to give the group write access to allow other processes to access the files.
        // TODO: Narrow down file access by using different users and groups for different services depending on their relationships.
        "sudo chmod -Rf g+wx " + options.env.PIO_HOME
        */		
	}

    exports.generateServicePrerequisiteCommands = function (options) {

        API.ASSERT(typeof options.env, "object");
        API.ASSERT(typeof options.remote, "object");

        return [
            'if [ ! -d "' + options.env.PIO_SERVICE_HOME + '" ]; then',
            '  mkdir -p "' + options.env.PIO_SERVICE_HOME + '"',
    //                "  " + sudoCommand + "chown -f " + state["pio.vm"].user + ":" + state["pio.vm"].user + " " + state["pio.service.deployment"].path,
            // NOTE: When deploying as root we need to give the group write access to allow other processes to access the files.
            // TODO: Narrow down file access by using different users and groups for different services depending on their relationships.
    //                "  " + sudoCommand + "chmod -f g+wx " + state["pio.service.deployment"].path,
            'fi',
            // NOTE: When deploying as root we need to give the group write access to allow other processes to access the files.
            // TODO: Narrow down file access by using different users and groups for different services depending on their relationships.
    //                sudoCommand + 'chmod -f g+wx "' + state["pio.service.deployment"].path + '/sync" || true',
            'if [ ! -e "' + options.env.PIO_HOME + '/node_modules/' + options.env.PIO_SERVICE_ID + '" ]; then',
            '  rm -Rf "' + options.env.PIO_HOME + '/node_modules/' + options.env.PIO_SERVICE_ID + '" > /dev/null || true',
            '  ln -s "' + options.remote.aspects.source.path + '" "' + options.env.PIO_HOME + '/node_modules/' + options.env.PIO_SERVICE_ID + '"',
            'fi'
        ];
    }

    exports.resolveServiceRuntimeTemplatePaths = function (options) {

        API.ASSERT(typeof options.local, "object");
        API.ASSERT(typeof options.remote, "object");

        var templateType = options.remote['pio.pinf.io/0'].runtime || "default";

        var paths = [];
        var parts = templateType.split("-");
        for (var i=1 ; i<=parts.length ; i++) {
            paths.push(API.PATH.join(__dirname, "runtimes", parts.slice(0, i).join("-")));
        }

console.log("resolveServiceRuntimeTemplatePaths PATHS", paths);

        return API.Q.resolve(paths);
    }
});
