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

  static toHTMLString(user, latestPrice) {
    const rows       = user.portfolio.stocks.map((stock, i) => {
      Logger.info('stock.costPrice: ' + stock.costPrice)
      Logger.info('latestPrice: ' + JSON.stringify(latestPrice))
      const row =
        `<tr>
          <td class="text-center">${stock.stockID}</td>
          <td class="text-center">${stock.units}</td>
          <td class="text-center">${parseFloat(stock.costPrice).toFixed(2)}</td>
          <td class="text-center">${latestPrice[i].l_fix}</td>
        </tr>`
      return row
    }).join('')

    const htmlString =
        `<div class="panel panel-warning">
          <div class="panel-heading">
            <div class="panel-title">
              <div class="text-center text-uppercase">
                <h4 class="text-capitalize">${user.firstname} ${user.lastname}</h4>
                <div>
                  Portfolio
                </div>
              </div>
            </div>
          </div>
          <table class="table table-condensed">
            <thead>
              <tr>
                <td class="text-center font-bold">Stock</td>
                <td class="text-center font-bold">Units</td>
                <td class="text-center font-bold">Cost Price</td>
                <td class="text-center font-bold">Current Price</td>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
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
          portfolio.stocks[i].units     += parseFloat(tradeOrder.units)
          portfolio.stocks[i].costPrice += parseFloat(tradeOrder.tradePrice) * parseFloat(tradeOrder.units)
        } else if ( tradeOrder.type == TradeOrder.Type.SELL ) {
          const units                    = Math.min(parseFloat(portfolio.stocks[i].units), parseFloat(tradeOrder.units))
          portfolio.stocks[i].costPrice -= parseFloat(tradeOrder.tradePrice) * parseFloat(units)
          portfolio.stocks[i].units     -= parseFloat(units)
        }
      }
    }

    if ( !exists ) {
      const stock = {
        stockID: tradeOrder.stockID,
        units: tradeOrder.units,
        costPrice: parseFloat(tradeOrder.units) * parseFloat(tradeOrder.tradePrice)
      }
      portfolio.stocks.push(stock)
    }

    Logger.info('Portfolio: ' + JSON.stringify(portfolio))

    return portfolio
  }
}

export default Portfolio
