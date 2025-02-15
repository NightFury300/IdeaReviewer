import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store from './store/store.js'
import {Provider} from 'react-redux'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import {Welcome,Login,SignUp,Dashboard,ProtectedRoute, Layout} from './components/index.js'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>}>
    <Route path='' element={<Welcome/>}/>
    <Route path='login' element={<Login/>}/>
    <Route path='signup' element={<SignUp/>}/>
    <Route path='dashboard' element={<ProtectedRoute element={<Dashboard/>}/>}/>
  </Route>
))

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
)
