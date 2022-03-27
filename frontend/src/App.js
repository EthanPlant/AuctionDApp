import "./App.scss";

import { useEffect, useState } from "react";
import {
	useWallet,
	useConnectedWallet,
	WalletStatus,
} from "@terra-money/wallet-provider";

import * as execute from "./contract/execute";
import * as query from "./contract/query";
import { ConnectWallet } from "./components/ConnectWallet";
import { Creator } from "./components/Creator";
import { Header } from "./components/Header";

function App() {
	const [count, setCount] = useState(null);
	const [updating, setUpdating] = useState(true);
	const [resetValue, setResetValue] = useState(0);

	const { status } = useWallet();

	const connectedWallet = useConnectedWallet();

	return (
		<>
			{/* <head>
				<meta name="terra-wallet" />
			</head> */}
			<div>
				<Header />
				<Creator />
			</div>
		</>
	);
}

export default App;
