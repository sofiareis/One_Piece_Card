import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import Search from "../pages/Search";
import Collection from "../pages/Collection";
import Landing from "../pages/Landing";
import Header from "./Header";
import Card from '../pages/Card';
import Missing from '../pages/Missing';
import Wishlist from '../pages/Wishlist';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

function Router() {
    const Layout = () => {
        return(
          <>
            <Header />
            <Outlet />
          </>
        )
      }

    // return(
    //     <BrowserRouter>
    //         <Routes>
    //             <Route path="/" element={<Layout />}>
    //                 <Route path='/' element={<Search />} />
    //                 <Route path='/collection' element={<Collection />} />
    //             </Route>
    //         </Routes>
    //     </BrowserRouter>
    // )

    const BrowserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <Landing />
                },
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    path: "/signup",
                    element: <SignUp />
                },
                {
                    path: "/search",
                    element: <Search />
                },
                {
                    path: "/collection",
                    element: <Collection />
                },
                {
                    path: "/missing",
                    element: <Missing />
                },
                {
                    path: "/wishlist",
                    element: <Wishlist />
                },
                {
                    path: "/card",
                    element: <Card />
                },
                {
                    path: "/card/:cid",
                    element: <Card />
                },
            ]
        }
    ])

    return(
        <RouterProvider router={BrowserRouter} />
    )
}

export default Router