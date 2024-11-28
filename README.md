# Bango Backend


1. Profile Page
    - Profile Pic
    - All the Transations 
    - All the Events Participated 
    - All the Events created by them 
    - Username 
    - User about 
    - Wallet address 

2. Change Harcode messageXsignature verification to timestamp one 
   User will address and timestamp with bango hardocde string, we will verify if timestamp is more than 1 min old then reject auth



3. Add discription in event
4. Multi outcome architecture


=================================================================================================================================================================


Play Money - Offchain Prediction Market 

-> Event 
    outcomes -> Conditional Tokens[]


-> Conditional Token
    id | eg: 1
    evnet | eg: 1
    outcome title | eg: Yes
    current token supply | init 0
    total liquidity | 0 
    users [{userid, tokenallocated}] | eg [[swapnil, 100], [tanuj, 200]]

-> TokenAllocation 
    id | eg 1 
    userId Primary key
    conditionalTokenId Primary Key | eg 1
    amount | eg 100




=> AMM
    1. User will give token id 
    2. Tigdam -> Token Price
    3. User will pay the Token Price 
    4. AMM will update the total liquidity of the Token and token supply [Mint new Token]

    Event ID
    Outcome ID
    Trade Type
    Quantity 
    Current Price


Update volume by checking Outcome supply



=================================================================================================================================================================


AMM 

                Outcomes A   | Outcome B
supply            200           150
Liquidity         4000          2000

Buy A -> Order
AMM -> getprice A

Aweight A = A.liquidity / A.Supply 
totalWeight = A.liquidity / A.Supply +  B.liquidity / B.Supply ... n


currentprice = Awight / totalWeight]



1. Error in query apis sort by 
2. Trade/eventid giving all outcomes 
3. rename user-outcome-shares 




# volume 
eg buy and sell is done then volume is the additon of assets buyed and sold in total tx