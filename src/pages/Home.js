import React from 'react'
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import banners from '../data/banners.json'
import RSTable from '../RSTable'
import AggregateTable from '../AggregateTable';
import CBanner from '../banners/CBanners'
import SBanner from '../banners/SBanner'
import WBanner from '../banners/WBanner'
import './Home.css'

const pullColors = {
  3: '#14aec9',
  4: '#bf0ecf',
  5: '#c79b18'
}

const colorPull = (pull, column) => {
  let style = {}
  if(pullColors[pull.rarity]) style.color = pullColors[pull.rarity]
  style.fontWeight = column === 'name' ? "bold" : "light"
  return style
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
      epDropOpen: false,
      epitomeValue: "",
      activeType: '',
      activeBanner: null,
      bannerObject: null,
      displayedPulls: [],
      aggregate: {},
      statBlock: {}
    }
  }

  resetBanner(originalReducer) {
    let reducer = {
      ...originalReducer,
      aggregate: {
        5: {},
        4: {},
        3: {}
      },
      statBlock: {
        5: 0,
        4: 0,
        3: 0,
        Total5: 0,
        Total4: 0
      },
      displayedPulls: [],
      epitomeValue: "",
    }
    switch(originalReducer.activeType || this.state.activeType) {
      case 's':
        reducer.bannerObject = new SBanner()
        break
      case 'w':
        reducer.bannerObject = new WBanner(reducer.activeBanner || this.state.activeBanner)
        break
      case 'c':
        reducer.bannerObject = new CBanner(reducer.activeBanner || this.state.activeBanner)
        break
      default:
        throw new Error('Invalid Banner Type')
    }

    this.setState(reducer)
  }

  pull(repeats = 10) {
    if(!this.state.bannerObject) return
    let newList = []
    let newAggregate = Object.assign({}, this.state.aggregate)
    let newStats = Object.assign({}, this.state.statBlock)
    for(let i = 0; i < repeats; i++) {
      const newPull = this.state.bannerObject.roll(this.state.epitomeValue)

      // Update Aggregate Table
      if(newAggregate[newPull.rarity][newPull.name]) {
        newAggregate[newPull.rarity][newPull.name]++
      }
      else {
        newAggregate[newPull.rarity][newPull.name] = 1
      }

      // Update Stats
      newStats[newPull.rarity]++
      if(newPull.rarity === 5) newStats.Total5 += newPull.pity5
      else if(newPull.rarity === 4) newStats.Total4 += newPull.pity4

      // Push to display list
      newList.push(newPull)
    }
    this.setState({
      displayedPulls: newList,
      statBlock: newStats,
      aggregate: newAggregate
    })
  }

  setEpitome(epitomeValue) {
    this.setState({epitomeValue})
  }

  calcStatBlock () {
    const toPercent = (n) => {
      return `${Math.round(n * 10000)/100}%`
    }

    const block = this.state.statBlock
    if(!this.state.bannerObject || this.state.bannerObject.total === 0) {
      return <p>No stats to display</p>
    }
    else {
      const total = this.state.bannerObject.total
      return (
        <div>
          <p>Total Pulls: {total}</p>
          <p style={{color: pullColors[5]}}>5* Rate: {toPercent(block[5]/total)}</p>
          <p style={{color: pullColors[4]}}>4* Rate: {toPercent(block[4]/total)}</p>
          <p style={{color: pullColors[3]}}>3* Rate: {toPercent(block[3]/total)}</p>
          <p style={{color: pullColors[5]}}>Avg 5* Pity: {block[5] === 0 ? 0 : Math.round(block.Total5 / block[5] * 100)/100}</p>
          <p style={{color: pullColors[4]}}>Avg 4* Pity: {block[4] === 0 ? 0 : Math.round(block.Total4 / block[4] * 100)/100}</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="full">
        <h2>Genshin Gacha :(</h2>
        <div>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={(e) => this.setState({dropdownOpen: !this.state.dropdownOpen})}>
            <DropdownToggle caret>
              {this.state.activeType ? (this.state.activeBanner ? this.state.activeBanner.fullName : "Standard Banner") : "Select a Banner..."}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={()=>this.resetBanner({activeType: 's', activeBanner: null})}>Standard Banner</DropdownItem>

              <DropdownItem header>Character</DropdownItem>
              {Object.keys(banners.character).map(bannerName => <DropdownItem key={bannerName} onClick={()=>this.resetBanner({activeType: 'c', activeBanner: banners.character[bannerName]})}>{bannerName}</DropdownItem>)}
            
              <DropdownItem header>Weapon</DropdownItem>
              {Object.keys(banners.weapon).map(bannerName => <DropdownItem key={bannerName} onClick={()=>this.resetBanner({activeType: 'w', activeBanner: banners.weapon[bannerName]})}>{bannerName}</DropdownItem>)}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div>
          {this.state.activeBanner ? <RSTable columns={['rarity', 'type', 'name']} data={this.state.activeBanner.promo5.concat(this.state.activeBanner.promo4)}/> : null}
        </div>
        <hr/>
        <div className="main">
          <h3>Wishing</h3>
          <div>
            <Button className="controlBtn" onClick={this.resetBanner.bind(this)}>Reset</Button>
            <Button className="controlBtn" onClick={() => this.pull(1)}>Wish</Button>
            <Button className="controlBtn" onClick={() => this.pull(10)}>Wish x10</Button>
            <Button className="controlBtn" onClick={() => this.pull(100)}>Wish x100</Button>
            <Button className="controlBtn" onClick={() => this.pull(1000)}>Wish x1000</Button>
            <p>{(this.state.bannerObject ? `Active Banner: ${this.state.activeBanner ? this.state.activeBanner.fullName : 'Standard Banner'}. 5* Pity=${this.state.bannerObject.pity5} Guarantee=${this.state.bannerObject.guarantee5 } EP=${this.state.bannerObject.epCount || 0}` : 'No Active Banner')}</p>
          </div>
          <div>
          <ButtonDropdown isOpen={this.state.epDropOpen} toggle={() => this.setState({epDropOpen: !this.state.epDropOpen})}>
            <DropdownToggle caret disabled={!this.state.bannerObject || !(this.state.bannerObject instanceof WBanner)}>
              Epitomized Path: {this.state.epitomeValue || "N/A"}
            </DropdownToggle>
            <DropdownMenu>
              {
                (this.state.bannerObject && this.state.bannerObject instanceof WBanner) 
                ? this.state.bannerObject.bannerInfo.promo5.map(promoItem => <DropdownItem key={promoItem.name} onClick={()=> this.setEpitome(promoItem.name)}>{promoItem.name}</DropdownItem>) 
                : <DropdownItem>Placeholder</DropdownItem>
              }
            </DropdownMenu>
          </ButtonDropdown>
          </div>
          <RSTable columns={['pity5', 'pity4', 'rarity', 'type', 'specType', 'name', 'rc']} data={this.state.displayedPulls} highlight={(pull, column) => colorPull(pull, column)}/>
        </div>
        <div className="aux">
          
          <div>
            <h3>Statistics</h3>
            {this.calcStatBlock()}
          </div>
          <h3>Items Acquired</h3>
          <AggregateTable data={this.state.aggregate} pullColors={pullColors}/>
        </div>
      </div>
    )
  }
}

export default Home;