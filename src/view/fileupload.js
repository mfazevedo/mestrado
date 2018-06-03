import React                  from 'react'

import {
		Upload,
        Icon,
        message,
	   }                      from 'antd';

const Dragger = Upload.Dragger;



export class FileUpload extends React.Component {

	state = {
		file: null

	}

	constructor(props){
		super(props)
		this.loaded = this.loaded.bind(this) 
	}

	getAsText(readFile) {
		var file = readFile.file

		var reader = new FileReader();
		console.log('files', file)
		reader.readAsText(file);
		//reader.readAsBinaryString(file)
		// Handle progress, success, and errors

		reader.onprogress = this.updateProgress;
		reader.onload = this.loaded;
		reader.onerror = this.errorHandler;

		console.log('Reader teste', reader)
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
	  
	  errorHandler(evt) {
		if(evt.target.error.name === "NotReadableError") {
			message.error('Não foi possível ler o arquivo');
		}
	  }

	  readFile(){
		var lines = this.state.file.split('\n');
		console.log('Lines', lines)
	  }
	  

	render(){
		return(
			<div className = 'app-dragger'> 
			<Dragger
				name= 'file'
				multiple= {false}
				customRequest={(file)=>this.getAsText(file)}
				onChange={this.onChange}
			>
				<p className="ant-upload-drag-icon">
					<Icon type="cloud-upload" />
				</p>
				<p className="ant-upload-text">Clique ou Arraste o arquivo para Upload</p>
				<p className="ant-upload-hint">Selecione o arquivo contendo o Benchmark para análise</p>
			</Dragger>
			</div>
		)
	}
}