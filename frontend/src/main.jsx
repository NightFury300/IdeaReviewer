import { createRoot } from 'react-dom/client'
import store from './store/store.js'
import {Provider} from 'react-redux'
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from 'react-router-dom'
import {Login,SignUp,Dashboard, Layout} from './pages/index.js'
import './main.css'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>}>
    <Route path='' element={<Navigate to="/dashboard" replace />}/>
    <Route path='login' element={<Login/>}/>
    <Route path='signup' element={<SignUp/>}/>
    <Route path='dashboard' element={<Dashboard/>}/>
  </Route>
))

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
)
