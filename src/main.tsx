/* eslint-disable @typescript-eslint/no-unused-vars */
// tslint:enable:no-unused-variable
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainMenu } from "./Pages/MainMenu";
import { Rules } from "./Pages/Rules";
import { Game } from "./Pages/Game";
import { GameVsCPU } from "./Pages/GameVsCPU";
import "./index.css";
import { AppContextProvider } from "./GlobalState/Context/AppContext";


const router = createBrowserRouter([
	{
		path: "/Connect-4",
		element: <MainMenu />,
	},
	{
		path: "/Connect-4/rules",
		element: <Rules />,
	},
	{
		path: "/Connect-4/game",
		element: <Game />,
	},
	{
		path: "/Connect-4/game-vs-cpu",
		element: <GameVsCPU />,
	}
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<AppContextProvider>
			<RouterProvider router={router} />
		</AppContextProvider>
	</React.StrictMode>
);
