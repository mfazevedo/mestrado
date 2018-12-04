import React        				from 'react'
import { bindActionCreators }   	from 'redux'
import { connect }              	from 'react-redux'

import {
		Icon,
		Timeline,
		Tooltip,
		Carousel,
	   }            				from 'antd';

class Routes extends React.Component {
	render(){
		const ClientNodes = (clients) => {
			let nodes = []
			for (var x in clients.clients.listedRequests){
				nodes.push(
					
					<Timeline.Item key={x} dot={(clients.clients.listedRequests[x].id == '0') ? <Icon type="home" /> : <Icon type="user" />}>
						<Tooltip placement="topLeft" title={
							<spam>X: {clients.clients.listedRequests[x].coordinateX} Y: {clients.clients.listedRequests[x].coordinateY} Demanda: {clients.clients.listedRequests[x].demand}</spam>
						}>{(clients.clients.listedRequests[x].id == '0') ? 'Depósito' : 'Atendimento' + clients.clients.listedRequests[x].id}
						</Tooltip>
					</Timeline.Item>
				)
			}
			return nodes
		}

		const VehiclesRoutes = () => {
			let routes = this.props.Solution.route	
			console.log('routes',routes)
			let tempRoutes = []	
			for (var x in routes){			
				tempRoutes.push(
      					<div key={x} style={{display:'inline-grid', margin:'20px', position:'relative'}}>
							<h3>
								<p>
									<Icon type="car" /> Veículo {routes[x].id}
								</p>
								<p>
									<Tooltip placement="topLeft" title={'Custo Rota'}><Icon type="bar-chart" /></Tooltip>
									<span>        {routes[x].routeCost}  </span>
									<Tooltip placement="topLeft" title={'Carga'}><Icon type="down-square-o" /></Tooltip>
									<span>        {routes[x].cargo}  </span>
								</p>
								<p>
									<Icon type="compass" /> {'Rota'}
								</p>														
								<Timeline>
									<ClientNodes clients={routes[x]} />
								</Timeline>
							</h3>
						</div>
				)				
			}
			return tempRoutes
		}

		return(

					<div style={{marginLeft:'70px', position:'relative'}}>
						<VehiclesRoutes className='Routes'/>
					</div>
		
		)
	}
}

function mapStateToProps(state){
	return{
	  Definitions: 	state.Definitions,
	  Requests:     state.Requests,
	  Solution: 	state.Solution,
	}
  }
  
  function matchDispatchToProps(dispatch){
	return bindActionCreators(
		{ 
			dispatch: dispatch,
		},
	  	dispatch
	)
  }
  
  export default connect (mapStateToProps, matchDispatchToProps)(Routes);