var React = require('react');
var ReactDOM = require('react-dom');
var Helper =require('./helpers');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navitation;           // mixin
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');


/*
 Application start from here
 */
var App = React.createClass({

	render : function () {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Good"/>
				</div>
				<Order/>
				<Inventory/>
			</div>
		);
	}

});

/*
	Header
 */
var Header = React.createClass({

	render : function () {
		return (
			<header className="top">
				<h1>
					Catch
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
					Day
				</h1>
				<h3 className="tagline"><span>{this.props.tagline}</span></h3>
			</header>
		)
	}

});

/*
	Order
 */
var Order = React.createClass({

	render : function () {
		return (
			<p>Order</p>
		);
	}

});

/*
	Inventory
 */
var Inventory = React.createClass({

	render : function () {
		return (
			<p>Inventory</p>
		);
	}

});

/*
	StorePicker
	This will let us create <StorePicker/>
*/
var StorePicker = React.createClass({
	mixins : [History],
	goToStore : function (event) {
		event.preventDefault();
		
		// get the date from the input
		console.log(this.refs);
		var storeID = this.refs.storeID.value;
		
		// transition from <StorePicker/> to <App/>
		this.history.pushState(null, '/store/' + storeID);
		
	},

	render : function (){
		return(
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>
					Please enter A store.
				</h2>
				<input type="text" ref="storeID" defaultValue={Helper.getFunName()} required />
				<input type="Submit" />

			</form>
		);
	}
});

/*
	Not Fount
 */
var NotFound = React.createClass({
	render : function () {
		return <h1>Not Found!</h1>
	}
});

/*
	Routes
 */
var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker}/>
		<Route path="/store/:storeID" component={App}/>
		<Route path="*" component={NotFound}/>
	</Router>
);


ReactDOM.render(routes, document.querySelector('#main'));