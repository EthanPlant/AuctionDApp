import {
	LCDClient,
	MsgExecuteContract,
	MsgInstantiateContract,
	Fee,
} from "@terra-money/terra.js";
import { contractAdress } from "./address";

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _instantiate =
	(itemName, itemDesc, startingPrice, isActive) => async (wallet) => {
		const lcd = new LCDClient({
			URL: wallet.network.lcd,
			chainID: wallet.network.chainID,
		});

		const { result } = await wallet.post({
			msgs: [
				new MsgInstantiateContract(
					wallet.walletAddress,
					"",
					contractAdress(wallet)
				),
			],
		});

		while (true) {
			try {
				return await lcd.tx.txInfo(result.txhash);
			} catch (e) {
				if (Date.now() < untilInterval) {
					await sleep(500);
				} else if (Date.now() < until) {
					await sleep(1000 * 10);
				} else {
					throw new Error(
						`Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
					);
				}
			}
		}
	};

const _exec =
	(msg, fee = new Fee(200000, { uluna: 10000 })) =>
	async (wallet) => {
		const lcd = new LCDClient({
			URL: wallet.network.lcd,
			chainID: wallet.network.chainID,
		});

		const { result } = await wallet.post({
			fee,
			msgs: [
				new MsgExecuteContract(
					wallet.walletAddress,
					contractAdress(wallet),
					msg
				),
			],
		});

		while (true) {
			try {
				return await lcd.tx.txInfo(result.txhash);
			} catch (e) {
				if (Date.now() < untilInterval) {
					await sleep(500);
				} else if (Date.now() < until) {
					await sleep(1000 * 10);
				} else {
					throw new Error(
						`Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
					);
				}
			}
		}
	};

// ==== execute contract ====

export const increment = _exec({ increment: {} });

export const createAuction = _instantiate({
	item_name: "",
	item_desc: "",
	starting_price: 0,
	is_active: true,
});

export const reset = async (wallet, count) =>
	_exec({ reset: { count } })(wallet);
