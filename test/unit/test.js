const assert = require('assert');
const request = require('request-promise');

describe('Hello, Guest! API Endpoint', () => {
    it('should return "Hello, Guest!" message', async () => {
        try{
            const response = await request({
                method: 'GET',
                uri: 'https://34.36.188.6.nip.io/iciciproxy1',
                json: true
            });
            console.log(response)
            assert.equal(response, 'Hello, Guest!');
        }catch(err){
            console.log(err)
        }
    });
});
