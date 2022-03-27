import { LCDClient } from "@terra-money/terra.js";
import { contractAdress } from "./address";

export const getItemName = async (wallet) => {
	const lcd = new LCDClient({
		URL: wallet.network.lcd,
		chainID: wallet.network.chainID,
	});
	return lcd.wasm.contractQuery(contractAdress(wallet), {
		get_item_name: "",
	});
};

export const getItemDesc = async (wallet) => {
	const lcd = new LCDClient({
		URL: wallet.network.lcd,
		chainID: wallet.network.chainID,
	});
	return lcd.wasm.contractQuery(contractAdress(wallet), {
		get_item_desc: "",
	});
};

export const getStartingPrice = async (wallet) => {
	const lcd = new LCDClient({
		URL: wallet.network.lcd,
		chainID: wallet.network.chainID,
	});
	return lcd.wasm.contractQuery(contractAdress(wallet), {
		get_starting_price: 0,
	});
};

export const getIsActive = async (wallet) => {
	const lcd = new LCDClient({
		URL: wallet.network.lcd,
		chainID: wallet.network.chainID,
	});
	return lcd.wasm.contractQuery(contractAdress(wallet), {
		get_is_active: true,
	});
};
