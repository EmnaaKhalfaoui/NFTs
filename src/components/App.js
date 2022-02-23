import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import Navbar from '../components/Navbar/Navbar'
import swal from "sweetalert";
import sound from './sound.mp3'; 
import correctSound from './correctSound.mp3';


const CARD_ARRAY = [
  {
    name: '1',
    img: '/images/1.png'
  }, 
  {
    name: '2',
    img: '/images/2.png'
  },
  
  {
    name: '3',
    img: '/images/3.png'
  },
  {
    name: '5',
    img: '/images/5.png'
  },
  {
    name: '7',
    img: '/images/7.png'
  },
  {
    name: '6',
    img: '/images/6.png'
  },
  {
    name: '1',
    img: '/images/1.png'
  },
  {
    name: '4',
    img: '/images/4.png'
  },
  {
    name: '2',
    img: '/images/2.png'
  },
  {
    name: '3',
    img: '/images/3.png'
  }, 
  {
    name: '8',
    img: '/images/8.png'
  },
  {
    name: '5',
    img: '/images/5.png'
  },
  {
    name: '7',
    img: '/images/7.png'
  },
  {
    name: '6',
    img: '/images/6.png'
  },
  {
    name: '4',
    img: '/images/4.png'
  }, 
  {
    name: '8',
    img: '/images/8.png',
    
  }
]

let wrongAnswer = new Audio(sound) 
let correctAnswer = new Audio(correctSound)


class App extends Component {

 

      
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Load smart contract
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    if(networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)
      this.setState({ token })
      const totalSupply = await token.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Tokens
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    } else {
      alert('Smart contract not deployed to detected network.')
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    else if(this.state.cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/question.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }


  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId == optionTwoId) {
      swal({
        title: "Focus",
        text: "You have clicked the same image!",
        icon: "info",
        button: "Ok"
      });
      wrongAnswer.play();
    
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
       swal({
        title: "Congratulations!",
        text: "You found the match",
        icon: "success",
        button: "Proceed to reclaim"
      }); 
      correctAnswer.play()
      this.state.token.methods.mint(
        this.state.account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
          tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
        })
      })
    } else {
 
      swal({
        title: "Oops!",
        text: "Wrong match",
        icon: "error",
        button: "Try again?"
      }); 
      wrongAnswer.play();
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_ARRAY.length) {
       alert('Congratulations! You found them all!')
       swal({
        title: "Congratulations!",
        text: "You found them all!",
        icon: "success",
        button: "YEY"
      });
     
    
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }


  render() {
    return (
      <div>
       <Navbar/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-xl-12 d-flex text-center" >
              <div className="content mr-auto ml-auto">
                {/* <h1 className="hide">Reclame your tokens</h1> */}

                <div className="grid mb-12" >

                { this.state.cardArray.map((card, key) => {
                    return(
                      <img alt=''
                      
                        key={key}
                        src={this.chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          if(!this.state.cardsWon.includes(cardId.toString())) {
                            this.flipCard(cardId)
                          }
                        }}
                      />
                    )
                  })}


                </div>
                <div>

                <h5>You have collected<span id="result">&nbsp;{this.state.tokenURIs.length} token</span></h5>

<div className="grid mb-3" >

  { this.state.tokenURIs.map((tokenURI, key) => {
    return(
      <img 
      alt=''
        key={key}
        src={tokenURI}
      />
    )
  })}

</div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
