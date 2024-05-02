import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainMenu } from "./Pages/MainMenu";
import { Rules } from "./Pages/Rules";
import { Game } from "./Pages/Game";
import "./index.css";
import { AppContextProvider } from "./GlobalState/Context/AppContext";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainMenu />,
	},
	{
		path: "/rules",
		element: <Rules />,
	},
	{
		path: "/game",
		element: <Game />,
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<AppContextProvider>
			<RouterProvider router={router} />
		</AppContextProvider>
	</React.StrictMode>
);
