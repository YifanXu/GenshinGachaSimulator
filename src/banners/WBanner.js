import Banner from './Banner'

const rate5 = 0.007
const rate4 = 0.05
const softPityStart4 = 7
const softPityArr4 = [
  0.4237,
  0.2138,
  1
]
const softPityStart = 62
const softPityArr = [
  0.0820,
  0.1496,
  0.2172,
  0.2917,
  0.3627,
  0.4255,
  0.4974,
  0.5734,
  0.6378,
  0.7100,
  0.7308,
  0.6190,
  0.5417,
  0.5455,
  0.5123,
  0.0400,
  0.6677,
  1
]

class CBanner extends Banner {
  constructor(banner, version) {
    super()
    this.guarantee5 = false
    this.guarantee4 = false
    this.bannerInfo = banner
    this.epCount = 0
    this.version = version

    this.filterCatalog(banner.details[version].startDate, banner.promo5.concat(banner.details[version].promo4))
  }

  rollRarity(rc) {
    if ((this.pity5 >= softPityStart && rc >= 1 - softPityArr[this.pity5 - softPityStart]) || rc >= 1 - rate5) {
      this.pity4++;
      this.pity5 = 0
      return 5
    }
    if (this.pity4 - softPityStart4 >= softPityArr4.length || (this.pity4 >= softPityStart4 && rc <= softPityArr4[this.pity4 - softPityStart4]) || rc <= rate4) {
      this.pity4 = 0
      this.pity5++;
      return 4
    }
    this.pity4++;
    this.pity5++;
    return 3
  }

  roll(ep) {
    const startingPity4 = this.pity4;
    const startingPity5 = this.pity5;
    const rc = Math.random()
    const rarity = this.rollRarity(rc)

    let rewardList = []
    let rateUpReward = null
    switch (rarity) {
      case 3:
        rewardList = this.catalog.weapon3
        break;
      case 4:
        if (this.guarantee4 || Math.random() > 0.25) {
          // Get promotional
          rewardList = this.bannerInfo.details[this.version].promo4
          this.guarantee4 = false
        }
        else {
          // 50/50 Character or banner
          this.guarantee4 = true
          rateUpReward = this.bannerInfo.details[this.version].promo4
          if (Math.random() > 0.5) {
            rewardList = this.catalog.character4
          }
          else {
            rewardList = this.catalog.weapon4
          }
        }
        break;
      case 5:
        if (this.guarantee5 || this.epCount >= 2 || Math.random() > 0.25) {
          this.guarantee5 = false
          rewardList = this.bannerInfo.promo5
        }
        else {
          this.guarantee5 = true
          rateUpReward = this.bannerInfo.promo5
          rewardList = this.catalog.weapon5
        }
        break;
      default:
          throw new Error(`unknown rarity ${rarity}`)
    }

    // Randomly pick from reward list
    const sc = Math.random()

    const scIndex = Math.floor(sc * rewardList.length)
    let reward = rewardList[scIndex]

    // Force Epitomized Path Item
    if(rarity === 5) {
      if (this.epCount >= 2 && reward.name !== ep) {
        for (const item of rewardList) {
          if(item.name === ep) {
            reward = item
            break
          }
        }
        this.epCount = 0
      }
      else {
        if(reward.name === ep) {
          this.epCount = 0
        }
        else if (ep) {
          this.epCount++
        }
      }
    }

    // Resets guarantee if reward was taken from standard pool, but still part of the rate up
    // Ex. Beidou is on rate up but the 50/50 was lost. Reward from standard pool still resulted in a beidou
    if (rateUpReward) {
      for (const rateUpItem of rateUpReward) {
        if (reward === rateUpItem.name) {
          if (this.rarity === 4) this.guarantee4 = false
          else this.guarantee5 = false
          break
        }
      }
    }

    this.total++;
    return {
      ...reward,
      rc: Math.round(rc * 10000) / 10000,
      sc: Math.round(sc * 10000) / 10000,
      rarity,
      pity4: startingPity4 + 1,
      pity5: startingPity5 + 1,
      total: this.total
    }
  }
}

export default CBanner
