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
 Main application interface
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
	Add fish form
	<AddFishForm />
 */
var AddFishForm = React.createClass({
	createFish : function (event) {
		// 1. stop the form from submitting
		event.preventDefault();
		// 2. take the data from the form and create an object
		var fish = {
			name : this.refs.name.value,
			price : this.refs.price.value,
			status : this.refs.status.value,
			desc : this.refs.desc.value,
			image : this.refs.image.value
		};
		// 3. add the fish to the App State
		console.log(fish);
	},
	render : function () {
		return (
		
			<form className="fish-edit" onSubmit={this.createFish}>
				<input type="text" ref="name" placeholder="Fish Name"/>
				<input type="text" ref="price" placeholder="Fish Price"/>
				<select ref="status">
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" ref="desc" placeholder="Description"></textarea>
				<input type="text" ref="image" placeholder="URL to Image" />
				<button type="submit">+ Add Fish </button>
			</form>
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
		);
	}

});

/*
	Order
	<Order />
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
	<Inventory />
 */
var Inventory = React.createClass({

	render : function () {
		return (
			<div>
				<h2 className="inventory">Inventory</h2>
				<AddFishForm/>
			</div>
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