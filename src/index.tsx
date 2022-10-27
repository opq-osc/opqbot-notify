import './public-path'

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

function render(props: any) {
  const { container } = props
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  )
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap() {
  console.log('bootstraped')
}

export async function mount(props: any) {
  render(props)
}

export async function unmount(props: any) {
  const { container } = props
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  )
}
