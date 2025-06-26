import { generate } from 'pegjs';

export const abiGrammar = `

Function
  =
  _ "function " _ name:Id _ "(" _ inputs:ComplexArgs _ ")" _ ":"
  _ "(" _ outputs:ComplexArgs _ ") " _ stateMutability:Id {
    return {
      type: "function",
      name,
      stateMutability,
      inputs,
      outputs,
    };
  }
  /
  _ "function " _ name:Id _ "(" _ ")" _ ":"
  _ "(" _ outputs:ComplexArgs _ ") " _ stateMutability:Id {
    return {
      type: "function",
      name,
      stateMutability,
      inputs: [],
      outputs,
    };
  }
  /
  _ "function " _ name:Id _ "(" _ inputs:ComplexArgs _ ")" _ ":"
  _ "(" _ ") " _ stateMutability:Id {
    return {
      type: "function",
      name,
      stateMutability,
      inputs,
      outputs: [],
    };
  }

ComplexArgs
  = head:ComplexArg tail:(_ "," _ ComplexArg)* {
    return tail.reduce(function(result, element) {
        return [result, element[3]].flat();
    }, head);
  }

ComplexArg
  =
  _ name:Id _ ":" _ "{" _ components:ComplexArgs _ "}[]" {
    return {
      name: name,
      type: "tuple[]",
      internalType: "struct[]",
      components
    };
  }
  /
  _ "{" _ components:ComplexArgs _ "}[]" {
    return {
      name: "",
      type: "tuple[]",
      internalType: "struct[]",
      components
    };
  }
  /
  _ name:Id _ ":" _ "{" _ components:ComplexArgs _ "}" {
    return {
      name: name,
      type: "tuple",
      internalType: "struct",
      components
    };
  }
  /
  _ "{" _ components:ComplexArgs _ "}" {
    return {
      name: "",
      type: "tuple",
      internalType: "struct",
      components
    };
  }
  /
  SimpleArg

SimpleArg
  =
  _ name:Id _ ":" _ type:Id "[]" {
    return {
      name,
      type: type + "[]",
      internalType: type + "[]",
    };
  }
  /
  _ name:Id _ ":" _ type:Id {
    return {
      name,
      type,
      internalType: type,
    };
  }
  /
  _ type:Id "[]" {
    return {
      name: "",
      type: type + "[]",
      internalType: type + "[]",
    };
  }
  /
  _ type:Id {
    return {
      name: "",
      type,
      internalType: type,
    };
  }

Id "identifier"
  = [a-zA-Z][a-zA-Z0-9]* { return text(); }

_ "whitespace"
  = [ \\t\\n\\r]*

  `;

const pegParser = generate(abiGrammar);

export const toJson = (compactAbiStr: string): any => {
  try {
    // console.log({ compactAbiStr });
    const abiJson = [pegParser.parse(compactAbiStr)];
    abiJson.forEach((a) => {
      a.payable = a.stateMutability === 'payable';
      if (!Array.isArray(a.inputs)) {
        a.inputs = [a.inputs];
      }
      if (!Array.isArray(a.outputs)) {
        a.outputs = [a.outputs];
      }
    });
    // console.log({ abiJson });
    return abiJson;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
