class TradeOrder {
  constructor(stockID, type, units, tradePrice, tradeDateTime) {
    this.stockID       = stockID
    this.type          = type
    this.units         = units
    this.tradePrice    = tradePrice
    this.tradeDateTime = tradeDateTime

    this.order      = {
      stockID:       this.stockID,
      type:          this.type,
      units:         this.units,
      tradePrice:    this.tradePrice,
      tradeDateTime: this.tradeDateTime
    }

    return this.order
  }

  static toHTMLString(tradeOrder) {
    const invoice =
      `<div class="panel panel-info">
        <div class="panel-heading">
          <div class="text-center text-uppercase">
            Invoice
          </div>
        </div>
        <table class="table table-condensed">
          <thead>
            <tr>
              <td class="text-center font-bold text-uppercase">Stock</td>
              <td class="text-center font-bold text-uppercase">Units</td>
              <td class="font-bold text-center">
                <div class="text-uppercase">
                  Share Value
                </div>
                <small>${tradeOrder.tradeDateTime}</small>
              </td>
              <td class="text-center font-bold text-uppercase">
              ${
                tradeOrder.type == TradeOrder.Type.BUY ? "Buying Price" : "Selling Price"
              }
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">${tradeOrder.stockID}</td>
              <td class="text-center">${tradeOrder.units}</td>
              <td class="text-center">${(tradeOrder.tradePrice).toFixed(2)}</td>
              <td class="text-center">${(tradeOrder.units * tradeOrder.tradePrice).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>`

    return invoice
  }
}

TradeOrder.Type      = { }
TradeOrder.Type.BUY  = 'buy'
TradeOrder.Type.SELL = 'sell'

export default TradeOrder
