export interface ParsedArguments {
    type: string;
    params: {
        [key: string]: any;
    };
}

export interface ParseOptions {
    template: string;
    mockFunction: Record<string, Function>;
    pools: Record<string, string>;
}

export type MockOptions =
    | {
          type: 'object';
          properties: {
              [key: string]: string | MockOptions;
          };
      }
    | {
          type: 'array';
          params: {
              generator: Function | string;
              length: number;
          };
      };

export interface GenerateRandomNumberOptions {
    min?: number;
    max?: number;
    decimalPlaces?: number;
}

export interface GenerateRandomIntegerOptions {
    min: number;
    max: number;
}

export interface GenerateRandomFloatOptions {
    min: number;
    max: number;
    decimalPlaces: number;
}

export interface GenerateRandomStringOptions {
    pools?: Record<string, string>;
    pool?: string | string[];
    length?: number;
}
export interface GenerateRandomBooleanOptions {
    prob?: number;
}

export interface GenerateRandomDateOptions {
    format?: string;
}
export interface GenerateRandomTimeOptions {
    format?: string;
}

export interface GenerateRandomArrayOptions {
    length: number;
    generator: () => any;
}
