#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary /*, BankMsg */, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{AuctionResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:auction";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        owner: info.clone().sender,
        item_name: msg.item_name,
        item_desc: msg.item_desc,
        starting_price: msg.starting_price,
        highest_bid: 0.0,
        highest_bidder: info.clone().sender,
        is_active: true,
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    STATE.save(deps.storage, &state);

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("item_name", state.item_name)
        .add_attribute("item_desc", state.item_desc)
        .add_attribute("starting_price", msg.starting_price.to_string())
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Bid { bid } => try_bid(deps, info, bid),
        ExecuteMsg::Cancel {} => try_cancel(deps, info),
        ExecuteMsg::EndAuction {} => try_end(deps, info),
    }
}

pub fn try_bid(
    deps: DepsMut,
    info: MessageInfo,
    bid: f64,
) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state: State| -> Result<_, ContractError> {
        if info.clone().sender == state.owner {
            return Err(ContractError::OwnerBidder {});
        }

        if bid <= state.highest_bid {
            return Err(ContractError::BidTooLow {bid: state.highest_bid });
        }

        if bid < state.starting_price {
            return Err(ContractError::BidTooLow {bid: state.starting_price});
        }

        state.highest_bid = bid;
        state.highest_bidder = info.clone().sender;
        Ok(state)
    })?;

    Ok(Response::new()
        .add_attribute("method", "bid")
        .add_attribute("bidder", info.sender)
        .add_attribute("bid_amount", bid.to_string())
    )
}

pub fn try_cancel(
    deps: DepsMut,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        if info.sender != state.owner {
            return Err(ContractError::Unauthorized {});
        }

        state.is_active = false;
        Ok(state)
    })?;

    Ok(Response::new().add_attribute("method", "cancel"))
}

pub fn try_end(
    deps: DepsMut,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        if info.sender != state.owner {
            return Err(ContractError::Unauthorized {});
        }

        state.is_active = false;
        Ok(state)
    })?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAuction {} => to_binary(&query_auction(deps)?)
        
        //QueryMsg::GetCount {} => to_binary(&query_count(deps)?),
    }
}

fn query_auction(deps: Deps) -> StdResult<AuctionResponse> {
    let state = STATE.load(deps.storage)?;
    Ok(AuctionResponse { item_name: state.item_name,
        item_desc: state.item_desc,
        starting_price: state.starting_price,
        highest_bid: state.highest_bid,
        is_active: state.is_active,})
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
//     use cosmwasm_std::{coins, from_binary};

//     #[test]
//     fn proper_initialization() {
//         let mut deps = mock_dependencies(&[]);

//         let msg = InstantiateMsg { count: 17 };
//         let info = mock_info("creator", &coins(1000, "earth"));

//         // we can just call .unwrap() to assert this was a success
//         let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
//         assert_eq!(0, res.messages.len());

//         // it worked, let's query the state
//         let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
//         let value: CountResponse = from_binary(&res).unwrap();
//         assert_eq!(17, value.count);
//     }

//     #[test]
//     fn increment() {
//         let mut deps = mock_dependencies(&coins(2, "token"));

//         let msg = InstantiateMsg { count: 17 };
//         let info = mock_info("creator", &coins(2, "token"));
//         let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

//         // beneficiary can release it
//         let info = mock_info("anyone", &coins(2, "token"));
//         let msg = ExecuteMsg::Increment {};
//         let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

//         // should increase counter by 1
//         let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
//         let value: CountResponse = from_binary(&res).unwrap();
//         assert_eq!(18, value.count);
//     }

//     #[test]
//     fn reset() {
//         let mut deps = mock_dependencies(&coins(2, "token"));

//         let msg = InstantiateMsg { count: 17 };
//         let info = mock_info("creator", &coins(2, "token"));
//         let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

//         // beneficiary can release it
//         let unauth_info = mock_info("anyone", &coins(2, "token"));
//         let msg = ExecuteMsg::Reset { count: 5 };
//         let res = execute(deps.as_mut(), mock_env(), unauth_info, msg);
//         match res {
//             Err(ContractError::Unauthorized {}) => {}
//             _ => panic!("Must return unauthorized error"),
//         }

//         // only the original creator can reset the counter
//         let auth_info = mock_info("creator", &coins(2, "token"));
//         let msg = ExecuteMsg::Reset { count: 5 };
//         let _res = execute(deps.as_mut(), mock_env(), auth_info, msg).unwrap();

//         // should now be 5
//         let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
//         let value: CountResponse = from_binary(&res).unwrap();
//         assert_eq!(5, value.count);
//     }
//}
