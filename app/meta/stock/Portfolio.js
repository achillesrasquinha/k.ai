import TradeOrder from './../../meta/stock/TradeOrder'
import Logger from './../../utils/Logger'

class Portfolio {
  constructor() {
    this.stocks    = [ ]

    this.portfolio = {
      stocks: this.stocks
    }

    return this.portfolio
  }

  static update(portfolio, tradeOrder) {
    const stockID = tradeOrder.stockID
    let   exists  = false

    Logger.info('Portfolio Recieved: ' + JSON.stringify(portfolio))

    for (var i = 0 ; i < portfolio.stocks.length ; ++i) {
      if ( stockID == portfolio.stocks[i].stockID ) {
        exists = true

        if ( tradeOrder.type == TradeOrder.Type.BUY ) {
          portfolio.stocks[i].units += tradeOrder.units
          // make sure you update price
        } else if ( tradeOrder.type == TradeOrder.Type.SELL ) {
          const units                = Math.min(portfolio.stocks[i].units, tradeOrder.units)
          portfolio.stocks[i].units -= units
        }
      }
    }

    if ( !exists ) {
      const stock = { stockID: tradeOrder.stockID, units: tradeOrder.units }
      portfolio.stocks.push(stock)
    }

    Logger.info('Portfolio: ' + JSON.stringify(portfolio))

    return portfolio
  }
}

export default Portfolio
