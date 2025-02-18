import { createRoot } from 'react-dom/client'
import store from './store/store.js'
import {Provider} from 'react-redux'
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from 'react-router-dom'
import {Login,SignUp,Home, Layout} from './pages/index.js'
import './main.css'
import PostIdea from './pages/PostIdea.jsx'
import { ProtectedRoute } from './components/index.js'
import MyIdeas from './pages/MyIdeas.jsx'
import EditIdea from './pages/EditIdea.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>}>
    <Route path='' element={<Home/>}/>
    <Route path='login' element={<Login/>}/>
    <Route path='signup' element={<SignUp/>}/>
    <Route path='ideas' element={<ProtectedRoute element={<MyIdeas/>}/>}/>
    <Route path='ideas/new' element={<ProtectedRoute element={<PostIdea/>}/>}/>
    <Route path='ideas/edit/:id' element={<ProtectedRoute element={<EditIdea/>}/>}/>
    <Route path='*' element={<Navigate to="/" replace/>}/>
  </Route>
))

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
)
