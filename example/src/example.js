var Editor = require('react-md-editor');
var marked = require('./markdown-it-compat');
var React = require('react');
var mdurl = require('mdurl');

function loadPermalink(cb) {

  if (!location.hash) { return; }

  var cfg, opts;

  try {

    if (/^#md3=/.test(location.hash)) {
      cfg = JSON.parse(mdurl.decode(location.hash.slice(5), mdurl.decode.componentChars));

    } else if (/^#md64=/.test(location.hash)) {
      cfg = JSON.parse(window.atob(location.hash.slice(6)));

    } else if (/^#md=/.test(location.hash)) {
      cfg = JSON.parse(decodeURIComponent(location.hash.slice(4)));

    } else {
      return;
    }
		
    if (cfg && cfg.source) {
			cb(cfg.source);
    }
	}
	catch(e) {
		
	}
}

var App = React.createClass({
	getInitialState () {
		return {
			code: ''//'# React Markdown Editor\n\n* A list\n\nSome **bold** and _italic_ text\n\n> A quote...\n\nBy [Jed Watson](https://github.com/JedWatson) and [Joss Mackison](https://github.com/jossmac)'
		};
	},
	updateCode (newCode) {
		this.setState({
			code: newCode
		});
		var permalink = '#md3=' + mdurl.encode(JSON.stringify({
			source: newCode,
	  }), '-_.!~', false);
		window.location.hash = permalink;
	},

	componentWillMount () {
		var that = this;
		loadPermalink(function(code) {
			that.updateCode(code);
		});
	},
	render () {
		var preview = marked.render(this.state.code);
		return (
			<div className="example">
				<div className="hint">The editor is below, with default options. This example also uses marked to generate the preview on the right as you type.</div>
				<div className="editor">
					<Editor value={this.state.code} onChange={this.updateCode} />
				</div>
				<div className="preview" dangerouslySetInnerHTML={{__html: preview}} />
			</div>
		);
	}
});

React.render(<App />, document.getElementById('app'));
