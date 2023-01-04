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
import MinerGame from "./pages/MinerGame/MinerGame";

const rootRoute = createRouteConfig({
  component: () => (
    <>
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/miner_game">Miner Game</Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

const routeConfig = rootRoute.addChildren([
  rootRoute.createRoute({
    path: "/",
    component: Home,
  }),
  rootRoute.createRoute({
    path: "/about",
    component: About,
  }),
  rootRoute.createRoute({
    path: "/miner_game",
    component: MinerGame,
  }),
]);

const router = createReactRouter({ routeConfig });

export default function App() {
  return <RouterProvider router={router} />;
}

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
