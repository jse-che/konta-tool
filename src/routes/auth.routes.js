import {createBrowserRouter} from 'react-router-dom'
import Login from '../components/Sign-in/Login'
import App from '../App'


const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login/></div>
  },
  {
    path: '/dashboard',
    element: <div><App/></div>
  }
])

export default router