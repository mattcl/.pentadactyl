/* use strict */
XML.prettyPrinting = false;
XML.ignoreWhitespace = false;
var INFO =
<plugin name="sandbox-switcher" version="0.1"
        href="#"
        summary="open current production URL in sandbox or vice versa"
        xmlns={NS}>
    <author email="mchunlum@imvu.com">Matt Chun-Lum</author>
    <license href="http://opensource.org/licenses/mit-license.php">MIT</license>
    <project name="Pentadactyl" min-version="1.0"/>
    <p>
        generates an <em>:open</em> or a <em>:tabopen</em> prompt with the current
        URL toggled between sandbox and production with the <em>e</em> and <em>E</em>
        keys respectively.
    </p>
</plugin>;
(function() {
    SandboxSwitcher = function(args) {
        this.settings = {
            production: 'www.imvu.com',
            sandbox: 'localhost.imvu.com',
            imvu_regex: new RegExp(/imvu/),
            api_regex: new RegExp(/api\.(localhost\.)?imvu\.com/),
            sandbox_regex: new RegExp(/(api\.)?localhost\.imvu\.com/),
            production_regex: new RegExp(/(www\.|api.)?imvu\.com/),
            http_regex: new RegExp(/http[s]?:\/\//),
            www_regex: new RegExp(/www/),
        };
    }

    SandboxSwitcher.prototype = {
        toggle: function (loc) {
            var is_api = this.settings.api_regex.test(loc);
            var is_sandbox = this.settings.sandbox_regex.test(loc);

            if (is_sandbox) {
                loc = loc.replace(this.settings.sandbox_regex, this.settings.production);
                if (is_api) {
                    loc = loc.replace(this.settings.http_regex, 'https://');
                    loc = loc.replace(this.settings.www_regex, 'api');
                }
            } else {
                loc = loc.replace(this.settings.production_regex, this.settings.sandbox);
                if (is_api) {
                    // api is http in sandbox
                    loc = loc.replace(this.settings.http_regex, 'http://api.');
                }
            }
            return loc;
        },
        is_imvu: function (loc) {
            return this.settings.imvu_regex.test(loc);
        }
    };

    sandboxSwitcher = new SandboxSwitcher();

    group.mappings.add([modes.NORMAL], ['e'],
        'toggle between sandbox and production',
        function () {
            var loc = content.window.location.href;
            if (sandboxSwitcher.is_imvu(loc)) {
                CommandExMode().open('open ' + sandboxSwitcher.toggle(loc));
            }
        }
    );

    group.mappings.add([modes.NORMAL], ['E'],
        'toggle between sandbox and production, open in new tab',
        function () {
            var loc = content.window.location.href;
            if (sandboxSwitcher.is_imvu(loc)) {
                CommandExMode().open('tabopen ' + sandboxSwitcher.toggle(loc));
            }
        }
    );
})();
