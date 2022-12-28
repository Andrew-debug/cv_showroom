import {
  Outlet,
  RouterProvider,
  Link,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";

//////

import Home from "./components/Home";
import About from "./components/About";

const rootRoute = createRouteConfig({
  component: () => (
    <>
      <div>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

const homeRoute = rootRoute.createRoute({
  path: "/",
  component: Home,
});

const aboutRoute = rootRoute.createRoute({
  path: "/about",
  component: About,
});

const routeConfig = rootRoute.addChildren([homeRoute, aboutRoute]);

const router = createReactRouter({ routeConfig });

export default function App() {
  return <RouterProvider router={router} />;
}

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
