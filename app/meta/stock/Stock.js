class Stock {
  constructor(symbol, meta) {
    this.symbol   = symbol
    this.change   = meta.change

    this.stock    = {
      symbol: this.symbol,
      change: {
        value: this.change.value,
        percent: this.change.percent,
        type: this.change.type
      }
    }

    return this.stock
  }

  static toHTMLString(stocks) {
    const rows = stocks.map((stock) => {
      const row =
        `<tr>`                        +
          `<td>`                      +
            `${stock.symbol}`         +
          `<td>`                      +
          `<td>`                      +
            `<span class="${
              stock.change.type == Stock.Type.GAIN ? "text-success" : "text-danger"
            }">`                      +
            `${stock.change.value}`   +
            `</span>`                 +
          `</td>`                     +
          `<td>`                      +
            `<span class="${
              stock.change.type == Stock.Type.GAIN ? "text-success" : "text-danger"
            }">`                      +
            `${stock.change.percent}` +
            `</span>`                 +
          `</td>`                     +
        `</tr>`

      return row
    })

    const htmlString =
        `<table class="table table-condensed"` +
          `<thead>`                             +
            `<tr>`                              +
              `<td>`                            +
                `Symbol`                        +
              `<td>`                            +
              `<td>`                            +
                `Change Value`                  +
              `</td>`                           +
              `<td>`                            +
                `Change (%)`                    +
              `</td>`                           +
            `</tr>`                             +
          `</thead>`                            +
          `<tbody>`                             +
            rows.join(' ')                      +
          `</tbody>`                            +
        `</table>`

    return htmlString
  }
}

Stock.Type      = { }
Stock.Type.GAIN = 'GAIN'
Stock.Type.LOSS = 'LOSS'

export default Stock
