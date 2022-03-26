use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub owner: Addr,
    pub item_name: String,
    pub item_desc: String,
    pub starting_price: f64,
    pub highest_bid: f64,
    pub highest_bidder: Addr,
    pub is_active: bool,
}

pub const STATE: Item<State> = Item::new("state");
