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

  static toHTMLString(portfolio, callback) {
    Request.get({ url:'http://finance.google.com/finance/info?client=ig&q=NSE:' + stockID}, (err, response, body) => {
      Logger.info('response from google finance: ' + body)

      let hack     = body.replace('//', '')
          hack     = body.replace('[',  '')
          hack     = body.replace(']',  '')
      let result   = JSON.stringify(eval('(' + hack + ')'))
          result   = JSON.parse(result)

      if ( err ) {
        throw err
        // you may have to respond the user
      } else {
        Logger.info('JSON result: ' + result)
        const tradePrice = parseFloat(result.l_fix)
        Logger.info('trading price: ' + tradePrice)

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
              
            </tbody>
          </table>
        </div>
        `
      }
    })
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
