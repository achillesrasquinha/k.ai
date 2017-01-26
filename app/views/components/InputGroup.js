import React from 'react'
import classnames from 'classnames'

class InputGroup extends React.Component {
	render() {
		return (
			<div className={classnames("form-group", { "has-error": this.props.error })}>
		      <label htmlFor={this.props.id} className="control-label">{this.props.label}</label>
		      <input onChange={this.props.onChange} id={this.props.id} className="form-control" name={this.props.name} type={this.props.type} value={this.props.value}/>
		      {this.props.error && <span className="help-block">{this.props.error.message}</span>}
		    </div>
		)
	}
}

InputGroup.propTypes   = {
	label:    React.PropTypes.string.isRequired,
	id:       React.PropTypes.string.isRequired,
	name:     React.PropTypes.string.isRequired,
	value:    React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func.isRequired
}

InputGroup.defaultProps = {
	type: 'text'
}

export default InputGroup