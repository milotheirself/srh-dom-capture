import { default as parserInterpret } from './parser-interpret';
import { default as parserReplicate } from './parser-replicate';

const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

/* interface */

fragment.parser = ({ target, option, render }) => {
  if (target.invalid) return { parsed: null };

  const parsedRep = parserReplicate.replica({ target, option });
  const parsed = {
    bounds: parserInterpret.applied({ target }).bounds,
    result: parsedRep.result,
    pledge: parsedRep.pledge,
  };

  return { parsed };
};

export default { ...fragment };
