//Erin J. LeFevre, 2020
//execute script when window is loaded

//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
	
	//dimensions
	var width = 960,
		height = 700;

	//create new svg container for the map
	var map = d3.select("body")
		.append("svg")
		.attr("class", "map")
		.attr("width", width)
		.attr("height", height);

	//create AlbersUsa equal area conic to include Alaska and Hawaii
	var projection = d3.geoAlbersUsa()
		.scale(1000)
		.translate([width / 2, height / 2]);
	
	//create the path generator for the map projection
	var path = d3.geoPath()
		.projection(projection);

	//use Promise.all to parallelize asynchronous data loading
	var promises = [];
	promises.push(d3.csv("data/wildfires_csv.csv")); //load attributes from csv
	//promises.push(d3.json("data/CA_MX.topojson")); //load background spatial data
	promises.push(d3.json("data/us-states_topo.topojson")); //load choropleth spatial data
	Promise.all(promises).then(callback);

	function callback(data){

		csvData = data[0];
		//ca_mx = data[1];
		us_states = data[1];

		//insert graticule code here		
		
		//translate us_states TopoJSON		
		//var canada_mexico = topojson.feature(ca_mx, ca_mx.objects.collection),
			states_background = topojson.feature(us_states, us_states.objects.collection).features;
		
		//add Canada/Mexico background countries
		//var countries = map.append("path")
			//.datum(canada_mexico)
			//.attr("class", "countries")
			//.attr("d", path);

		//add U.S states (choropleth)
		var regions = map.selectAll(".regions")
			.data(states_background)
			.enter()
			.append("path")
			
			.attr("class", function(d){
				return d.properties.name;
			})
			.attr("class", "regions")
			.attr("d", path);
	};
};