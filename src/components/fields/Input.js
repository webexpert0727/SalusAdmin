import React, {Component,PropTypes} from 'react'

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
    };
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
    this.props.updateAction(this.props.theKey,event.target.value);
  }

  render() {
    return (
            <div className="form-group label-floating is-empty">
                <label className="control-label"></label>
                <input type="text" className={this.props.class+" form-control"} onChange={this.handleChange}  value={this.state.value} />
            </div>
    )
  }
}
export default Input;

Input.propTypes = {
    updateAction:PropTypes.func.isRequired,
    theKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    class: PropTypes.string
};
