export default class RefsData {
    constructor(refs) {
      this.refs = refs;
    }
  
    findById = (id, ref_name) => {
      return this.refs[ref_name].find((el) => el.id === id) || false;
    }
}
  