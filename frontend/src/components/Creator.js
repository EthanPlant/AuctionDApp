import "./Creator.scss";

import { useEffect, useState } from "react";
import {
	useWallet,
	useConnectedWallet,
	WalletStatus,
} from "@terra-money/wallet-provider";

import * as execute from "../contract/execute";
import * as query from "../contract/query";
import { ConnectWallet } from "./ConnectWallet";

/*
    pub owner: Addr,
    pub item_name: String,
    pub item_desc: String,
    pub starting_price: f64,
    pub highest_bid: f64,
    pub highest_bidder: Addr,
    pub is_active: bool,
*/

export function Creator() {
	const [owner, setOwner] = useState("");
	const [itemName, setItemName] = useState("");
	const [itemDesc, setItemDesc] = useState("");
	const [startingPrice, setStartingPrice] = useState(0);
	const [highestBid, setHighestBid] = useState(0);
	const [highestBidder, setHighestBidder] = useState("");
	const [isActive, setIsActive] = useState(false);
	const [updating, setUpdating] = useState(true);

	const { status } = useWallet();

	const connectedWallet = useConnectedWallet();

	useEffect(() => {
		const prefetch = async () => {
			if (connectedWallet) {
				setOwner(connectedWallet.walletAddress);
				setItemName(
					(await query.getItemName(connectedWallet)).item_name
				);
				setItemDesc(
					(await query.getItemDesc(connectedWallet)).item_desc
				);
				setStartingPrice(
					(await query.getStartingPrice(connectedWallet))
						.starting_price
				);
			}
			setUpdating(false);
		};
		prefetch();
	}, [connectedWallet]);

	const onClickCreateAuction = async () => {
		setUpdating(true);
		await execute.createAuction(connectedWallet);
		setItemName((await query.getItemName(connectedWallet)).item_name);
		setItemDesc((await query.getItemDesc(connectedWallet)).item_desc);
		setStartingPrice(
			(await query.getStartingPrice(connectedWallet)).starting_price
		);
		setIsActive((await query.getIsActive(connectedWallet)).is_active);
		setUpdating(false);
	};

	return (
		<div>
			<header className="App-header">
				<div className="creator-container">
					{status === WalletStatus.WALLET_CONNECTED && (
						<div className="auction-inputs">
							<div>
								<div style={{ display: "inline" }}>
									<h3>Create an Auction</h3>
									<p>
										Fill in the fields to create an auction
										on the blockchain!
									</p>
								</div>
								<input
									type="text"
									onChange={(e) =>
										setItemName(+e.target.value)
									}
									placeholder="Item Name"
								/>
								<input
									type="text"
									onChange={(e) =>
										setItemDesc(+e.target.value)
									}
									placeholder="Item Description"
								/>
								<input
									type="text"
									onChange={(e) =>
										setStartingPrice(+e.target.placeholder)
									}
									placeholder="Starting Price"
								/>
							</div>
							<button
								onClick={onClickCreateAuction}
								type="button"
								className={"finalize-auction-button"}
							>
								{" "}
								Finalize{" "}
							</button>
						</div>
					)}
					<ConnectWallet />
				</div>
			</header>
		</div>
	);
}
