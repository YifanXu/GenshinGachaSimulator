import catalog from '../data/catalog.json'
import banners from '../data/banners.json'

export default class Banner {
    constructor() {
        this.pity5 = 0
        this.pity4 = 0
        this.total = 0
        this.catalog = catalog
        this.banners = banners
    }
}