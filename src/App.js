import React, { Component } from 'react'
import './App.css'
import {
		Layout,
	   } 					from 'antd'
import {FileUpload}         from './view'



const { Content } = Layout;

class App extends Component {
  render() {
    return (

		<Layout className='app-background'>
			<Content className='app-content'>
				<FileUpload/>
			</Content>
		</Layout>
    );
  }
}

export default App;
