/***********************************************************************
 Snapshot of NFT contract on Klaytn chain
 
 set contractAddress to (stringify) Smart Contract Address on line 14
 uncomment line 62;
 
 Author: Shamshod
 ***********************************************************************/

const path = require("path");
const axios = require('axios');
const fs = require("fs");

const contractAddress = '';
/**
 @param contractAddress : string Target contract address

 Function below fetches list of NFT holders from klaytn scope by contract address,
 gets address of holders of nftCount1 and nftCount2 NFT and saves to ./snapshot/holders{nftCount2}.json and ./snapshot/holders{nftCount2}.json

 */
async function getData(contractAddress) {
    const holders1 = [];
    const holders2 = [];
    const nftCount1 = 5;
    const nftCount2 = 10;
    const res = await axios.get(`https://api-cypress-v2.scope.klaytn.com/v2/tokens/${contractAddress}/holders?page=1`, {headers: {'origin': 'https://scope.klaytn.com'}});

    console.log(res.data);

    res.data?.result?.map(e => {
        if (Number(e.tokenCount) === nftCount2) {
            holders10.push(e.address)
        }
        if (Number(e.tokenCount) === nftCount1) {
            holders5.push(e.address)
        }
    })

    for (let i = 2; i < res.data.total / res.data.limit; i++) {
        const res = await axios.get(`https://api-cypress-v2.scope.klaytn.com/v2/tokens/${contractAddress}/holders?page=${i}`, {headers: {'origin': 'https://scope.klaytn.com'}});
        if (Number(res.data.result[0].tokenCount) < nftCount1) { // suppose that data sorted by tokenCount
            break;
        }
        console.log(res.data, i);
        res.data.result.map(e => {
            if (Number(e.tokenCount) === nftCount2) {
                holders10.push(e.address)
            }
            if (Number(e.tokenCount) === nftCount1) {
                holders5.push(e.address)
            }
        })
        await sleep(2000); // avoid captcha
    }

    let location = path.join(__dirname, './snapshot');
    fs.mkdirSync(location, { recursive: true });
    fs.writeFileSync(`/${location}/holders${nftCount1}.json`, JSON.stringify(holders1));
    fs.writeFileSync(`/${location}/holders${nftCount2}.json`, JSON.stringify(holders2));
}


//getData(contractAddress).then(e => console.log('finished'))


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
