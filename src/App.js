import React, { Component } from 'react'
import { Provider }      	from 'react-redux'
import {Store} 				from './store'
import './App.css'


import {
		Layout,
	   } 					from 'antd'

import {
		FileUpload,
		Routes,
	   }         			from './view'




const { Content } = Layout;

class App extends Component {
  render() {
    return (
		<Layout>
			<Provider store={Store}>
				<Content className='app-content'>
					<FileUpload/>
					<Routes/>
				</Content>
			</Provider>
		</Layout>
    );
  }
}

export default App;
