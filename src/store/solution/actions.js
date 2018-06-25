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

	//console.log('FindClosest >>>', tempClosest)
	
	tempRequestList.splice(0, 1)         					//Remove o item selecionado como tempClosest inicial da lista

	for (var x = 1; x < tempRequestList.length; x++){
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
	let vehicleUpdates = {
		listedRequests: vehicle.listedRequests.push(depot),
		routeCost: findDistance(vehicle, depot) + vehicle.routeCost,
	}
	vehicle = Object.assign({}, vehicle, vehicleUpdates) //Atualiza a carga atual do veículo
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
				
				console.log('A excluir rota interna:', closestRequest, 'Rota interna: ', tempSolution.availableRequests)
				let indexA = tempSolution.availableRequests.map(function(request) { return request.id }).indexOf(closestRequest.request.id)
				tempSolution.availableRequests.splice(indexA, 1) //Se foi atendido por um veículo remove da lista geral
				console.log('A excluir rota interna:', closestRequest, 'Rota interna após: ', tempSolution.availableRequests)
			}

			//console.log('feasibleRequests BEFORE>>', feasibleRequests)
			let indexB = feasibleRequests.map(function(request) { return request.id }).indexOf(closestRequest.request.id) //Encontra o index do elemento selecionado como mais proximo
			feasibleRequests.splice(indexB, 1) //Remove o item selecionado como mais proximo da lista de atendimentos possíveis, seja porque adicinou o mesmo ou não comportou
			//console.log('feasibleRequests AFTER>>', feasibleRequests)
		}
		closeVehicleRoute(vehicle, depot)
		tempSolution.route.push(vehicle)		
	}
	
	return {
		type: 'ADD_SOLUTION',
		payload: mountSolution(tempSolution.route)
	}
}

