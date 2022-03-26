use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// Initial auction details
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub owner: Addr,
    pub item_name: String,
    pub item_desc: String,
    pub starting_price: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Bid { bid: f64 }, // Place a bid
    Cancel {}, // Cancel the auction
    EndAuction {}, // End the auction and pay out the owner
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // GetAuction returns the current auction details in JSON
    GetAuction {},
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CountResponse {
    pub item_name: String,
    pub item_desc: String,
    pub starting_price: f64,
    pub highest_bid: f64,
    pub is_active: bool,
}
