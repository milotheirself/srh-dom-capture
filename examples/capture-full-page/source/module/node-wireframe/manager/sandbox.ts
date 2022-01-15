const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

fragment.create = (host: any) => {
  return new (class {
    // +
    host: any;

    // +
    constructor() {
      this.host = host;
    }
  })();
};

export default { ...fragment };
