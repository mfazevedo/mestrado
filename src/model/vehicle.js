class Vehicle{
	constructor(id, capacity){
		this.id             = id            // Id veículo
		this.cargo          = 0             // Carga inicial zerada
		this.capacity       = capacity      // Capacidade do veículo
	}       

	canHandleCargo(incomeCargo){
		if((this.cargo + incomeCargo) > this.capacity){
			return false
		}
		else{
			return true
		}
	}
}
export default Vehicle