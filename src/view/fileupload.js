import React        				from 'react'
import { bindActionCreators }   	from 'redux'
import { connect }              	from 'react-redux'
import {
	loadRequestsFromBenchmark,
	loadDefinitionsFromBenchmark,
} 									from '../store/benchmark'

import {
	closestsNeighbor,
}									from '../store/solution'


import {
		Upload,
        Icon,
		message,
		Button,
	   }            				from 'antd';

const Dragger = Upload.Dragger;

class FileUpload extends React.Component {

	state = {
		file: null,
		fileArray: [],
	}

	constructor(props){
		super(props)
		this.loaded = this.loaded.bind(this) 
	}

	getAsText(readFile) {
		var file = readFile.file

		var reader = new FileReader();
		reader.readAsText(file);
		//reader.readAsBinaryString(file)
		// Handle progress, success, and errors

		reader.onprogress = this.updateProgress;
		reader.onload = this.loaded;
		reader.onerror = this.errorHandler;
	}

	updateProgress(evt) {
		if (evt.lengthComputable) {
			message.info('Carregando...')
		}
	}
	  
	loaded(evt) {
		let fileString = evt.target.result;	

		this.setState({file: fileString})
		message.success('Arquivo carregado');

		this.readFile()
	}

	createRequests(){
		let requestList = []
		let tempFileList = this.state.fileArray
		let startLine = 9
		let capacity = parseFloat(tempFileList[4].substring(13, 16))
		let vehiclesQuantity = parseInt(tempFileList[4].substring(2, 4))
		
		for (var i = startLine; i < tempFileList.length -1 ; i++) {
			let id = (parseInt(tempFileList[i].substring(2, 5))).toString()
			let tempRequest = {
				id             : id, 
				coordinateX    : parseFloat(tempFileList[i].substring(10, 13)),
				coordinateY    : parseFloat(tempFileList[i].substring(22, 24)),
				demand         : parseFloat(tempFileList[i].substring(33, 35)),
				windowOpening  : parseFloat(tempFileList[i].substring(43, 46)),
				windowClose    : parseFloat(tempFileList[i].substring(54, 57)),
				serviceTime    : parseFloat(tempFileList[i].substring(66, 68)), 
				dinamism       : parseFloat(0),
			}
			requestList.push(tempRequest)			
		}   
		this.props.loadRequestsFromBenchmark(requestList)
		let tempDefinitions = {
			capacity: capacity,
			vehiclesQuantity: vehiclesQuantity,
			depot: requestList[0],
		}
		this.props.loadDefinitionsFromBenchmark(tempDefinitions)
		//this.setState({requests:requestList})    
	}
	  
	errorHandler(evt) {
		if(evt.target.error.name === "NotReadableError") {
			message.error('Não foi possível ler o arquivo');
		}
	}

	readFile(){
		var lines = this.state.file.split('\n');
		this.setState({fileArray: lines})
		this.createRequests()
	}  

	render(){
		return(
			<div className = 'app-dragger'> 
			<Dragger
				name= 'file'
				multiple= {false}
				customRequest={(file)=>this.getAsText(file)}				
				onChange={this.onChange}
				accept='.txt'
			>
				<p className="ant-upload-drag-icon">
					<Icon type="cloud-upload" />
				</p>
				<p className="ant-upload-text">Clique ou Arraste o arquivo para Upload</p>
				<p className="ant-upload-hint">Selecione o arquivo contendo o Benchmark para análise</p>
			</Dragger>
			<Button
				onClick={()=> this.props.closestsNeighbor(this.props.Definitions.depot, this.props.Requests.slice(1), this.props.Definitions.capacity)}
			>
				Vizinho Mais proximo
			</Button>
			</div>
		)
	}
}

function mapStateToProps(state){
	return{
	  Benchmark: 	state.Benchmark,
	  Definitions: 	state.Definitions,
	  Requests:     state.Requests,
	}
  }
  
  function matchDispatchToProps(dispatch){
	return bindActionCreators(
		{ 
			dispatch: dispatch,
			loadRequestsFromBenchmark: loadRequestsFromBenchmark,
			loadDefinitionsFromBenchmark: loadDefinitionsFromBenchmark,
			closestsNeighbor: closestsNeighbor,
		},
	  	dispatch
	)
  }
  
  export default connect (mapStateToProps, matchDispatchToProps)(FileUpload);