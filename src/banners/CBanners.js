import Banner from './Banner'

const rate5 = 0.006
const rate4 = 0.05
const rate4Soft = 0.3682
const softPityStart = 73;
const softPityArr = [
  0.0655,
  0.1245,
  0.1821,
  0.2437,
  0.3029,
  0.3624,
  0.4197,
  0.4879,
  0.5346,
  0.5888,
  0.6505,
  0.6916,
  0.6787,
  0.5714,
  0.4524,
  0.4783,
  1
]

class CBanner extends Banner {
  constructor(banner, version) {
    super()
    this.guarantee5 = false
    this.guarantee4 = false
    this.bannerInfo = banner
    this.version = version

    this.filterCatalog(banner.details[version].startDate, banner.promo5.concat(banner.details[version].promo4))
  }

  rollRarity(rc) {
    // Prevent hitting pity4 and pity 5 at the same time
    if ((this.pity4 === 8 && this.pity5 === 88) || this.pity4 >= 9 || (this.pity4 === 8 && rc <= rate4Soft) || rc <= rate4) {
      this.pity4 = 0
      this.pity5++;
      return 4
    }
    if ((this.pity5 >= softPityStart && rc >= 1 - softPityArr[this.pity5 - softPityStart]) || rc >= 1 - rate5) {
      this.pity4++;
      this.pity5 = 0
      return 5
    }
    this.pity4++;
    this.pity5++;
    return 3
  }

  roll() {
    const startingPity4 = this.pity4;
    const startingPity5 = this.pity5;
    const rc = Math.random()
    const rarity = this.rollRarity(rc)

    let rewardList = []
    let rateUpReward = null // Only set if 50/50 was lost
    switch (rarity) {
      case 3:
        rewardList = this.catalog.weapon3
        break;
      case 4:
        if (this.guarantee4 || Math.random() > 0.5) {
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
        if (this.guarantee5 || Math.random() > 0.5) {
          this.guarantee5 = false
          rewardList = this.bannerInfo.promo5
        }
        else {
          this.guarantee5 = true
          rewardList = this.catalog.character5
          rateUpReward = this.bannerInfo.promo5
        }
        break;
      default:
        throw new Error(`unknown rarity ${rarity}`)
    }

    // Randomly pick from reward list
    const sc = Math.random()

    const scIndex = Math.floor(sc * rewardList.length)
    const reward = rewardList[scIndex]

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
