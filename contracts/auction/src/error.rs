use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("Owner cannot bid on their own auction")]
    OwnerBidder {},

    #[error("Bid must be higher than {bid} LUNA")]
    BidTooLow { bid: f64 },
}
