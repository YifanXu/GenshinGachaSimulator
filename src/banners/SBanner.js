import Banner from './Banner'

const rate5 = 0.006
const rate4 = 0.05
const rate4Soft = 0.3682
const softPityStart = 73;
const softPityArr = [
  0.0737,
  0.1309,
  0.1902,
  0.2506,
  0.3081,
  0.3685,
  0.4290,
  0.4837,
  0.5438,
  0.5924,
  0.6432,
  0.6806,
  0.6722,
  0.5473,
  0.5299,
  0.4762,
  1
]

class SBanner extends Banner {
  constructor() {
    super()
    this.guarantee5 = 0
    this.guarantee4 = 0
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
    switch (rarity) {
      case 3:
        rewardList = this.catalog.weapon3
        break;
      case 4:
        // 50/50 Character or banner
        if (this.guarantee4 >= 2 || (this.guarantee4 > -2 && Math.random() > 0.5)) {
          this.guarantee4 = this.guarantee4 > 0 ? -1 : this.guarantee4 - 1
          rewardList = this.catalog.character4
        }
        else {
          this.guarantee4 = this.guarantee4 < 0 ? 1 : this.guarantee4 + 1
          rewardList = this.catalog.weapon4
        }
        break;
      case 5:
        if (this.guarantee5 >= 2 || (this.guarantee5 > -2 && Math.random() > 0.5)) {
          this.guarantee5 = this.guarantee5 > 0 ? -1 : this.guarantee5 - 1
          rewardList = this.catalog.character5
        }
        else {
          this.guarantee5 = this.guarantee5 < 0 ? 1 : this.guarantee5 + 1
          rewardList = this.catalog.weapon5
        }
        break;
    }

    // Randomly pick from reward list
    const sc = Math.random()

    const scIndex = Math.floor(sc * rewardList.length)
    const reward = rewardList[scIndex]

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

export default SBanner
