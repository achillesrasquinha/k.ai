import Request from 'request'

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

  static toHTMLString(portfolio, latestPrice) {
    const rows       = portfolio.stocks.map((stock, i) => {


      const row =
        `<tr>
          <td>${stock.stockID}</td>
          <td>${stock.units}</td>
          <td>${parseFloat(stock.costPrice).toFixed(2)}</td>
          <td>${latestPrice[i].l_fix}</td>
        </tr>`

      return row
    }).join('')

    const htmlString =
      `<div class="panel panel-warning">
        <div class="panel-heading">
          <div class="panel-title">
            <div class="text-center text-uppercase">
              Portfolio
            </div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Units</th>
              <th>Cost Price</th>
              <th>Current Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>`

      return htmlString
  }

  static update(portfolio, tradeOrder) {
    const stockID = tradeOrder.stockID
    let   exists  = false

    Logger.info('Portfolio Recieved: ' + JSON.stringify(portfolio))

    for (var i = 0 ; i < portfolio.stocks.length ; ++i) {
      if ( stockID == portfolio.stocks[i].stockID ) {
        exists = true

        if ( tradeOrder.type == TradeOrder.Type.BUY ) {
          portfolio.stocks[i].units     += tradeOrder.units
          portfolio.stocks[i].costPrice += tradeOrder.tradePrice * tradeOrder.units
        } else if ( tradeOrder.type == TradeOrder.Type.SELL ) {
          const units                    = Math.min(portfolio.stocks[i].units, tradeOrder.units)
          portfolio.stocks[i].costPrice -= tradeOrder.tradePrice * units
          portfolio.stocks[i].units     -= units
        }
      }
    }

    if ( !exists ) {
      const stock = {
        stockID: tradeOrder.stockID, units: tradeOrder.units }
      portfolio.stocks.push(stock)
    }

    Logger.info('Portfolio: ' + JSON.stringify(portfolio))

    return portfolio
  }
}

export default Portfolio
