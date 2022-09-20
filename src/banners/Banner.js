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

    filterCatalog(dateStr, promotionalItems) {
        const cutoff = new Date(dateStr).getTime()
        const filterItems = promotionalItems.map(item => item.name)

        const newCatalog  = {}

        Object.entries(this.catalog).forEach(([listName, list]) => {
            newCatalog[listName] = list.filter(listItem => !filterItems.includes(listItem.name) && (!listItem.release || new Date(listItem.release).getTime() < cutoff))
        })
        this.catalog = newCatalog
    }
}