const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/* utils */

fragment.svgData = ({ svg }) => {
  return `data:image/svg+xml,${svg}`;
};

export default { ...fragment };
