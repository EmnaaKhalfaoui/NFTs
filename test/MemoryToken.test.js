const { assert } = require('chai')

// eslint-disable-next-line no-undef
const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()


// eslint-disable-next-line no-undef
contract('Memory Token', (accounts) => {  
  let token 
  // eslint-disable-next-line no-undef
  before(async()=>{ 
    token = await MemoryToken.deployed() 
  })
  describe("deployment", async()=>{ 
    it("deployed correctly", async()=>{ 
      
      const address = token.address 
      // eslint-disable-next-line no-undef
      assert.notEqual(address,0x0 || '' || null || undefined)
      // eslint-disable-next-line no-undef


    })
  })

  describe("minting",async()=>{ 
    let result 
    it("mints tokens correctly",async()=>{ 
      await token.mint(accounts[0],'https://www.token-uri.com/nft') 
      result = await token.totalSupply() 
      assert.equal(result.toString(),'1','total supply correct') 

      result = await token.balanceOf(accounts[0]) 
      assert.equal(result.toString(),'1','balance correct') 

      result = await token.ownerOf('1') 
      assert.equal(result.toString(), accounts[0].toString(), 'correct owner')
      result = await token.tokenOfOwnerByIndex(accounts[0],0)

      let balance = await token.balanceOf(accounts[0]) 
      let tokenIds = [] 
      for (let i=0; i<balance; i++){ 
        let id=await token.tokenOfOwnerByIndex(accounts[0],i) 
        tokenIds.push(id.toString())
      } 
      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(),'correct tokenIds') 


    })
  })


})
