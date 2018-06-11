export class Request{
	constructor(obj){
		this.id             = obj.id            // Id do atendimento
		this.coordinateX    = obj.coordinateX   // Coordenada X do local do atendimento
		this.coordinateY    = obj.coordinateY   // Coordenada Y do local do atendimento
		this.demand         = obj.demand        // Demanda do atendimento
		this.windowOpening  = obj.windowOpening // Inicio da janela de atendimento
		this.windowClose    = obj.windowClose   // Fim da janela de atendimento
		this.serviceTime    = obj.serviceTime   // Tempo de serviço
		this.dinamism       = obj.dinamism      // Variavel dinamica
		this.client         = obj.client        // Cliente do atendimento
	}  
}