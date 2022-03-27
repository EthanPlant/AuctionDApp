import { useEffect, useState } from "react";
import {
	useWallet,
	useConnectedWallet,
	WalletStatus,
} from "@terra-money/wallet-provider";

import * as execute from "../contract/execute";
import * as query from "../contract/query";
import { ConnectWallet } from "./ConnectWallet";

export function Bidder() {
	const [highestBid, getHighestBid] = useState(0);
	const [updating, setUpdating] = useState(true);
	const [bidValue, setBidValue] = useState(0);

	const { status } = useWallet();

	const connectedWallet = useConnectedWallet();

	useEffect(() => {
		const prefetch = async () => {
			if (connectedWallet) {
				setBidValue((await query.getBidValue(connectedWallet)).bid);
			}
			setUpdating(false);
		};
		prefetch();
	}, [connectedWallet]);

	const onClickMakeBid = async () => {
		setUpdating(true);
		await execute.makeBid(bidValue);
		setBidValue((await query.getBidValue(connectedWallet)).bid);
		setUpdating(false);
	};

	return (
		<div className="App">
			<header className="App-header">
				<div style={{ display: "inline" }}>
					Highest Bid: {highestBid}{" "}
					{updating ? "(updating . . .)" : ""}
				</div>
				{status === WalletStatus.WALLET_CONNECTED && (
					<div style={{ display: "inline" }}>
						<input
							type="number"
							onChange={(e) => setBidValue(+e.target.value)}
							value={bidValue}
						/>
						<button onClick={onClickMakeBid} type="button">
							{" "}
							Make bid{" "}
						</button>
					</div>
				)}
				<ConnectWallet />
			</header>
		</div>
	);
}
