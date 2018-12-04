//------------------------------------------------------------------------------------
//Definição API Google MAPS
//------------------------------------------------------------------------------------  
/*global google*/
const google = window.google

const googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyALR63q-PBK46xUm5kNNPTniu9BUC8Ih2U',
	Promise: Promise
});


googleMapsClient.geocode({
	address: '1600 Amphitheatre Parkway, Mountain View, CA'
}).asPromise()
.then((response) => {
	console.log('>>> R1:', response.json.results);
})
.catch((err) => {
	console.log('>>> E1:', err);
})

var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var destinationA = 'Stockholm, Sweden';


var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
	{
		origins: [origin1],
		destinations: [destinationA],
		travelMode: 'DRIVING',
	}, 
	(response, status)=>{
		console.log('R3:',response,'status3',status)
	}
);


//------------------------------------------------------------------------------------
//findClosest(requestA /*Atencimento A*/, requestB /*Atencimento B*/)
//>>> Retorna a distância entre o Chamado A e o Chamado B
//------------------------------------------------------------------------------------
function findDistance(requestA, requestB){

	let xA = requestA.coordinateX
    let yA = requestA.coordinateY
    let xB = requestB.coordinateX
	let yB = requestB.coordinateY

	

  

	
	//console.log('xA: ',xA,'xB: ',xB,'yA: ',yA,'yB: ',yB,)

/* 	var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var origin2 = 'Greenwich, England';
var destinationA = 'Stockholm, Sweden';
var destinationB = new google.maps.LatLng(50.087692, 14.421150);

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: 'DRIVING',
    transitOptions: TransitOptions,
    drivingOptions: DrivingOptions,
    unitSystem: UnitSystem,
    avoidHighways: Boolean,
    avoidTolls: Boolean,
  }, callback);

function callback(response, status) {
  // See Parsing the Results for
  // the basics of a callback function.
}
 */

	return Math.sqrt(Math.pow((xB - xA), 2) + Math.pow((yB - yA), 2)) //Encontra a distância geométrica (Fórmula)
}

//------------------------------------------------------------------------------------
//findClosest(request /*Atencimento origem*/, requestList /*Lista de atendimentos*/)
//>>> Retorna o atendimento mais proximo
//------------------------------------------------------------------------------------
function findClosest(request, requestList){
	let tempRequestList = requestList.slice()
	let tempRequest = (requestList[0].id == "0") ? requestList[1] : requestList[0]
	let tempClosest = {
		request: tempRequest, 						 //Assume o primeiro atendimento como o mais proximo do "request"
		distance: findDistance(request, tempRequest), //Calcula a distância entre os pontos
	}

	tempRequestList.splice((requestList[0].id == "0") ? 1 : 0, 1)         					//Remove o item selecionado como tempClosest inicial da lista

	for (var x = 0; x < tempRequestList.length; x++){
		let tempDistance = findDistance(request, tempRequestList[x])
		if (tempDistance < tempClosest.distance){
			tempClosest = Object.assign({}, {
				request: tempRequestList[x],
				distance: tempDistance,
			})
		}
	}	
	return tempClosest
}

//------------------------------------------------------------------------------------
//mountSolution(route /*Array de veículos com suas sub-rotas*/)
//>>> Retorna um array de objetos contendo os veículos com suas rotas adicionado do custo total da solução
//------------------------------------------------------------------------------------
function mountSolution(route){
	let routeCost = 0
	for (var x in route){
		routeCost += route[x].routeCost
	}

	let solution = {
		route: route,
		cost: routeCost,
	}

	return solution
}	

//------------------------------------------------------------------------------------
//closeVehicleRoute(vehicle /*Objeto veículo com suas sub-rotas*/, depot /*Depósito origem*/)
//>>> Adiciona o depósito como ponto final da rota do veículo assim como seu custo de locomoção até o mesmo
//------------------------------------------------------------------------------------
function closeVehicleRoute(vehicle, depot){
	
	let distance = findDistance(vehicle.listedRequests.slice(-1)[0], depot)
	let vehicleUpdates = {
		listedRequests: vehicle.listedRequests,
		routeCost: distance + vehicle.routeCost,
	}

	vehicleUpdates.listedRequests.push(depot)
	console.log('VehiclieUPD>>>',vehicleUpdates)
	return vehicleUpdates //Atualiza a carga atual do veículo
}	

//------------------------------------------------------------------------------------
//closestsNeighbor(depot /*Depósito origem*/, requestList /*Lista de atendimentos*/, capacity /*Capacidade do veículo*/)
//>>> Salva uma solução na Store utilizando a heurística do vizinho mais próximo
//------------------------------------------------------------------------------------
export function closestsNeighbor(depot, requestList, capacity) {
	//console.log('Input', requestList)

	let tempSolution = {
		availableRequests: requestList.slice(),
		route: [],
	}

	let count = 0
	while (tempSolution.availableRequests.length > 0) {
		//console.log('tempSolution.availableRequests.length: ',tempSolution.availableRequests.length, 'Route: ', tempSolution.route)
		count += 1
		let feasibleRequests = tempSolution.availableRequests.slice()
		let vehicle = {
			id: count,            	// Id veículo
			cargo: 0,       		// Carga inicial zerada
			capacity: capacity,     // Capacidade do veículo
			listedRequests: [depot], // Lista de atendimentos atribuídos
			routeCost: 0,
		}

		while (feasibleRequests.length > 0){
			//console.log('feasibleRequests.length: ',feasibleRequests.length, 'feasibleRequests: ', feasibleRequests)
			let closestRequest = findClosest(vehicle.listedRequests.slice(-1)[0], feasibleRequests) //Mais próximo do ultimo atendimento inserido
			//console.log('closestRequest >>>>>',closestRequest )
			if ((closestRequest.request.demand + vehicle.cargo) <= vehicle.capacity){ //Caso a demanda seja comportada pelo veículo atual
				let vehicleUpdates = {
					cargo: closestRequest.request.demand + vehicle.cargo,
					routeCost: closestRequest.distance + vehicle.routeCost,
					listedRequests: vehicle.listedRequests.slice(),
				}
				vehicleUpdates.listedRequests.push(closestRequest.request),
				//console.log('Vehicle >>> ', vehicleUpdates)
				vehicle = Object.assign({}, vehicle, vehicleUpdates) //Atualiza a carga atual do veículo
				
				//console.log('A excluir rota interna:', closestRequest, 'Rota interna: ', tempSolution.availableRequests)
				let indexA = tempSolution.availableRequests.map(function(request) { return request.id }).indexOf(closestRequest.request.id)
				tempSolution.availableRequests.splice(indexA, 1) //Se foi atendido por um veículo remove da lista geral
				//console.log('A excluir rota interna:', closestRequest, 'Rota interna após: ', tempSolution.availableRequests)
			}

			//console.log('feasibleRequests BEFORE>>', feasibleRequests)
			let indexB = feasibleRequests.map(function(request) { return request.id }).indexOf(closestRequest.request.id) //Encontra o index do elemento selecionado como mais proximo
			feasibleRequests.splice(indexB, 1) //Remove o item selecionado como mais proximo da lista de atendimentos possíveis, seja porque adicinou o mesmo ou não comportou
			//console.log('feasibleRequests AFTER>>', feasibleRequests)
		}
		vehicle = Object.assign({}, vehicle, closeVehicleRoute(vehicle, depot))
		tempSolution.route.push(vehicle)		
	}
	
	return {
		type: 'ADD_SOLUTION',
		payload: mountSolution(tempSolution.route)
	}
}

