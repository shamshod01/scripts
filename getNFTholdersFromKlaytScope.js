const path = require("path");
const axios = require('axios');
const fs = require("fs");

const contractAddress = '';
/**
 @param contractAddress : string Target contract address

 Function below fetches list of NFT holders from klaytn scope by contract address,
 gets address of holders of 5 and 10 NFT and saves to ./snapshot/holders5.json and ./snapshot/holders10.json

 */
async function getData(contractAddress) {
    const holders5 = [];
    const holders10 = [];
    const res = await axios.get(`https://api-cypress-v2.scope.klaytn.com/v2/tokens/${contractAddress}/holders?page=1`, {headers: {'origin': 'https://scope.klaytn.com'}});

    console.log(res.data);

    res.data?.result?.map(e => {
        if (Number(e.tokenCount) === 10) {
            holders10.push(e.address)
        }
        if (Number(e.tokenCount) === 5) {
            holders5.push(e.address)
        }
    })

    for (let i = 2; i < res.data.total / res.data.limit; i++) {
        const res = await axios.get(`https://api-cypress-v2.scope.klaytn.com/v2/tokens/${contractAddress}/holders?page=${i}`, {headers: {'origin': 'https://scope.klaytn.com'}});
        if (Number(res.data.result[0].tokenCount) < 5) { // suppose that data sorted by tokenCount
            break;
        }
        console.log(res.data, i);
        res.data.result.map(e => {
            if (Number(e.tokenCount) === 10) {
                holders10.push(e.address)
            }
            if (Number(e.tokenCount) === 5) {
                holders5.push(e.address)
            }
        })
        await sleep(2000); // avoid captcha
    }

    let location = path.join(__dirname, './snapshot');
    fs.mkdirSync(location, { recursive: true });
    fs.writeFileSync(`/${location}/holders5.json`, JSON.stringify(holders5));
    fs.writeFileSync(`/${location}/holders10.json`, JSON.stringify(holders10));
}


//getData(contractAddress).then(e => console.log('finished'))


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
