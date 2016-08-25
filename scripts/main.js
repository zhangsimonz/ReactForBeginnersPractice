var React = require("react");
var ReactDOM = require("react-dom");
var Helper =require("./helpers");

var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;  // mixin TODO: don't understand this yet, do some research when if video course does not cover
var createBrowserHistory = require("history/lib/createBrowserHistory");

// Firebase
var Rebase = require("re-base");
var base = Rebase.createClass("https://fishshopdemo.firebaseio.com/");

/*
 Main application interface
 */
var App = React.createClass({

	getInitialState : function () {
		return {
			fishes : {},
			order : {}
		}
	},
	
	componentDidMount : function () {
		base.syncState(this.props.params.storeID + "/fishes", {
			context : this,
			state : "fishes"
		});
	},
	
	addToOrder : function(key) {
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({ order : this.state.order });
	},
	
	addFish : function (fish) {
		var timestamp = (new Date()).getTime();
		// update the state object
		this.state.fishes['fish-' + timestamp] = fish;
		// set the state object
		this.setState({fishes : this.state.fishes});
	},
	
	loadSamples : function () {
		this.setState({
			fishes : require('./sample-fishes')
		});
	},
	
	renderFish : function (key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
	},
	
	render : function () {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Good"/>
					<ul className="list-of-fish">
						{Object.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order}/>
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		);
	}

});

/*
	Fish
	<Fish />
 */
var Fish = React.createClass({
	
	onButtonClick : function () {
		console.log("Going to add the fish: ", this.props.index);
		var key = this.props.index;
		this.props.addToOrder(key);
	},
	
	render : function () {
		var details = this.props.details;
		var isAvailable = (details.status === 'available' ? true : false);
		var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!');
		return (
			<li className="menu-fish">
				<img src={details.image} alt={details.name} />
				<h3 className="fish-name">
					{details.name}
					<span className="price">{Helper.formatPrice(details.price)}</span>
				</h3>
				<p>{details.desc}</p>
				<button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
			</li>
		)
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
		this.props.addFish(fish);
		this.refs.fishForm.reset();
	},
	render : function () {
		return (
		
			<form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
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
	<Header />
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
	
	renderOrder : function (key) {
		var fish = this.props.fishes[key];
		var count = this.props.order[key];
		
		if(!fish){
			return <li key={key}>Sorry, fish no longer available!</li>
		}
		
		// displays the details which are titles and amount in cart
		return (
			<li>
				{count}lbs {fish.name}
				<span className="price">
					{Helper.formatPrice(count * fish.price)}
				</span>
			</li>
		);
	},

	render : function () {
		var orderIDs = Object.keys(this.props.order);
		
		var total = orderIDs.reduce((prevTotal, key) =>{
			var fish = this.props.fishes[key];
			var count = this.props.order[key];
			// not calculating if it is not available
			var isAvailable = fish && fish.status === 'available';
			
			if(fish && isAvailable){
				return prevTotal + (count * parseInt(fish.price) || 0);
			}
			
			return prevTotal;
		}, 0);
		
		return (
			<div className="order-wrap">
				<h2 className="order-title">Your Order</h2>
				<ul className="order">
					{orderIDs.map(this.renderOrder)}
					<li className="total">
						<strong>Total:</strong>
						{Helper.formatPrice(total)}
					</li>
				</ul>
			</div>
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
				<h2>Inventory</h2>
				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
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
				<input type="Submit" content="Submit"/>

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
	TODO: constantly getting warnings from Chrome Dev Tools at the moment, no solution yet, may check later
	TODO: warning message: You are manually calling a React.PropTypes validation function for the `components` prop on `Route`.
	TODO: This is deprecated and will not work in the next major version. You may be seeing this warning due to a third-party PropTypes library.
 */
var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker}/>
		<Route path="/store/:storeID" component={App}/>
		<Route path="*" component={NotFound}/>
	</Router>
);


ReactDOM.render(routes, document.querySelector('#main'));