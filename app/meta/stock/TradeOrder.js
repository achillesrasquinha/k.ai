class TradeOrder {
  constructor(stockID, type, units, tradePrice) {
    this.stockID    = stockID
    this.type       = type
    this.units      = units
    this.tradePrice = tradePrice

    this.order      = {
      stockID:    this.stockID,
      type:       this.type,
      units:      this.units,
      tradePrice: this.tradePrice
    }

    return this.order
  }

  static toHTMLString(tradeOrder) {
    const invoice =
      `<div class="panel panel-info">` +
      `<div class="panel-heading">`     +
        `<div class="text-center text-uppercase">` +
          `Invoice`                     +
        `</div>`                        +
      `</div>`                          +
      `<div class="panel-body">`        +
        `<div class="row">`             +
          `<div class="col-md-4">`      +
            `<h4>Stock</h4>`            +
            `<div>`                     +
              `${tradeOrder.stockID}`   +
            `</div>`                    +
          `</div>`                      +
          `<div class="col-md-4">`      +
            `<h4>Units</h4>`            +
            `<div>`                     +
              `${tradeOrder.units}`     +
            `</div>`                    +
          `</div>`                      +
          `<div class="col-md-4">`      +
            `<h4>
            ${
              tradeOrder.type == TradeOrder.Type.BUY ? "Buying Price" : "Selling Price"
            }
            </h4>`                      +
            `<div>`                     +
              `${(tradeOrder.units * tradeOrder.tradePrice).toFixed(2)}` +
            `</div>`                    +
          `</div>`                      +
        `</div>`                        +
      `</div>`                          +
      `</div>`                          +
    `</div>`

    return invoice
  }
}

TradeOrder.Type      = { }
TradeOrder.Type.BUY  = 'buy'
TradeOrder.Type.SELL = 'sell'

export default TradeOrder
