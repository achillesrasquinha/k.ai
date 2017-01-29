import moment from 'moment'
import _ from 'lodash'
import Logger from './../../utils/Logger'

class News {
  static toHTMLString(news) {
    const htmlString =
      `<div class="panel panel-${ _.shuffle(["warning", "primary", "info", "danger"])[0] }">
        <div class="panel-heading">
          <div class="panel-title">
            ${news.title}
          </div>
          <div>
            <small>${moment(news.date).local().format('YYYY MMMM, Do')}</small>
          </div>
        </div>
        <div class="panel-body">
          <div class="text-jusitfy">
            ${news.description}
          </div>
        </div>
        <div class="panel-footer">
          <a href="${news.link}">Link</a> for more details.
        </div>
      </div>`

    return htmlString
  }
}

export default News
