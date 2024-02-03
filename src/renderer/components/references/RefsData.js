export default class RefsData {
  constructor(refs) {
    this.refs = refs;
  }

  findTypeById(id) {
    return this.findById(id, 'types');
  }

  findStatusById(id) {
    return this.findById(id, 'statuses');
  }

  findStateById(id) {
    return this.findById(id, 'states');
  }

  findCategoryById(id) {
    return this.findById(id, 'typeCategories');
  }

  findById = (id, ref_name) => {
    return this.refs[ref_name].find((el) => el.id === id) || false;
  }
}
  