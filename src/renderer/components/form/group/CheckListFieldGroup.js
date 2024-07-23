import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from '../EventForm.module.css';
import { Checkbox,} from "@blueprintjs/core";

export default class CheckListFieldGroup extends PureComponent {
  constructor (props)  {super(props);
    this.state = {
      checkedList:  this.props.options.filter((opt, i) => this.props.defaultValue.includes(opt.value)),
    };
    // console.log('this.state.checkedList', this.state.checkedList)
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    index: PropTypes.number,
    onChange: PropTypes.func,
    validator: PropTypes.string,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.array,
  };

  static defaultProps = {
    caption: '',
    index: 0,
    onChange: () => {},
    validator: '',
    options: [],
    disabled: false,
    defaultValue: [],
  };

  handleSelectChange = (event) => {
    let checkedList = this.state.checkedList
    let value = event.target.value;
    //
    if(event.target.type === "text") {
      const index = parseInt(event.target.attributes.getNamedItem('index').value)
      // console.log('event.target.name=', event.target.name, 'checkedList=', checkedList)
      // console.log({i, index})
      const checkedId = event.target.dataset.id
      checkedList.forEach((item, i) => {
        if(item.value === Number(checkedId)) {
          checkedList[i]['qty'] = value
        }
      })
      //checkedList[index]['qty'] = value
    } else {
      const item = JSON.parse(value);
      const checked = JSON.parse(event.target.checked);
      if(checked) checkedList.push(item);
      else checkedList = checkedList.filter(obj => obj.value !== item.value)
    }
    this.setState({checkedList,});
    this.props.onChange(this.props.name, this.state.checkedList, this.props.id, );
  };

  render() {
    const invalid = this.props.validator !== '';
    const caption = this.props.caption !== '' ? this.props.caption : this.props.name;
    const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';
    const opts = {};
    if (this.props.disabled) opts.disabled = 'disabled';
    // const defaultValue = this.props.options.filter((t) => this.props.defaultValue.includes(t.value));

    return (
      <div style={{ marginTop: '1em' }} className={`bp5-form-group bp5-flex${invalidMaybeClass}`}>
        <label
          htmlFor={this.props.name}
          className={`bp5-label bp5-inline ${styles.label_text}`}
        >
          {caption}
        </label>
        <div
          className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}
        >
          <div style={{ display: 'flex' }}>
            <div className="bp5-fill" style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
                {this.props.options.map((item, i) => {
                  return <div style={{width:'100%', display: 'flex', 'justifyContent': 'space-between'}} key={`${this.props.name}_field_${i}`}>
                    <Checkbox
                      key={`${this.props.name}_chekbox_${i}`}
                      name={this.props.name}
                      label={item.label}
                      // checked={this.props.defaultValue.includes(item.value)}
                      checked={this.state.checkedList.map(item => item.value).includes(item.value)}
                      defaultIndeterminate={false}
                      style={{maxWidth:(item?.qty ? '70%': '100%'), display:'inline-flex'}}
                      onChange={this.handleSelectChange}
                      value={JSON.stringify(item)}
                    />
                    {item.hasOwnProperty('qty') && <input
                      disabled={!this.state.checkedList.map(item => item.value).includes(item.value)}
                      key={`material_${item.value}`}
                      name={`material_${item.value}`}
                      data-id={item.value}
                      index={i}
                      value={item.qty ? item.qty : ""}
                      type="text"
                      style={{maxWidth:'30%', display:'inline-flex'}}
                      onChange={this.handleSelectChange}
                    />}
                  </div>
                })}
              {/* <Select
                id={this.props.name}
                name={this.props.name}
                defaultValue={defaultValue}
                isMulti
                closeMenuOnSelect={false}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={this.props.style}
                options={this.props.children}
                onChange={this.handleSelectChange}
              /> */}
            </div>
          </div>
          {invalid && (
            <div className="bp5-form-helper-text">{this.props.validator}</div>
          )}
        </div>
      </div>
    );
  }
}
