/// <reference path="MotionSchema.Model.ts" />

class MotionStore
{
    private _typeChecker = {
        "object": _.isObject.bind(_),
        "array": _.isArray.bind(_),
        "integer": _.isNumber.bind(_),
        "string": _.isString.bind(_),
        "boolean": _.isBoolean.bind(_),
        "any": () => { return true; }
    };

    private _validateType(schema: JSON, json: JSON): boolean
    {
        return this._typeChecker[schema['type']](json);
    }

    private _containsChecker = {
        "object": (schema: JSON, _object: JSON) =>
        {
            var expected_keys = _.keys(schema['properties']);
            var result: boolean = true;

            _.forEach(expected_keys, (expected_key) =>
            {
                if (result === false) return;

                if (!_.has(_object, expected_key))
                {
                    result = Boolean(schema['properties'][expected_key]['optional']);
                }
            });

            return result;
        },
        "array": (schema: JSON, _array: Array<JSON>) =>
        {
            var fulfill_minItems: boolean = true;
            var fulfill_maxItems: boolean = true;

            if (_.has(schema, 'minItems'))
            {
                fulfill_minItems = (schema['minItems'] <= _array.length);
            }

            if (_.has(schema, 'maxItems'))
            {
                fulfill_maxItems = (_array.length <= schema['maxItems']);
            }

            return (fulfill_minItems && fulfill_maxItems);
        },
        "integer": (schema: JSON, _integer: number) =>
        {
            var fulfill_minimum: boolean = true;
            var fulfill_maximum: boolean = true;

            if (_.has(schema, 'minimum'))
            {
                fulfill_minimum = (schema['minimum'] <= _integer);
            }

            if (_.has(schema, 'maximum'))
            {
                fulfill_maximum = (_integer <= schema['maximum']);
            }

            return (fulfill_minimum && fulfill_maximum);
        },
        "string": (schema: JSON, _string: string) =>
        {
            var fulfill_minLength: boolean = true;
            var fulfill_maxLength: boolean = true;

            if (_.has(schema, 'minLength'))
            {
                fulfill_minLength = (schema['minLength'] <= _string.length);
            }

            if (_.has(schema, 'maxLength'))
            {
                fulfill_maxLength = (_string.length <= schema['maxLength']);
            }

            return (fulfill_minLength && fulfill_maxLength);
        },
        "boolean": () => { return true; },
        "any": () => { return true; }
    };

    private _validateContains(schema: JSON, json: JSON): boolean
    {
        if (this._validateType(schema, json))
        {
            return this._containsChecker[schema['type']](schema, json);
        }
        else if (_.isUndefined(json))
        {
            return Boolean(schema['optional']);
        }

        return false;
    }

    private _typeTraversable = {
        "object": (schema: JSON, _object: JSON) =>
        {
            var child_schema = schema['properties'];
            var expected_keys = _.keys(child_schema);

            var traversable = [];

            _.forEach(expected_keys, (expected_key) =>
            {
                traversable.push({
                    "schema": child_schema[expected_key],
                    "json": _object[expected_key]
                });
            });

            return traversable;
        },
        "array": (schema: JSON, _array: Array<JSON>) =>
        {
            var child_schema = schema['items'];

            var traversable = [];

            _.forEach(_array, (item) =>
            {
                traversable.push({
                    "schema": child_schema,
                    "json": item
                });
            });

            return traversable;
        },
        "integer": (schema: JSON, _object: JSON) => { return []; },
        "string": (schema: JSON, _object: JSON) => { return []; },
        "boolean": (schema: JSON, _object: JSON) => { return []; },
        "any": (schema: JSON, _object: JSON) => { return []; }
    };

    private _traverse(schema: any, json: JSON): void
    {
        if (!this._validateContains(schema, json))
        {
            console.log('Bad format!:\n - schema = %O\n - json = %O', schema, json);

            throw "Bad format!";
        }

        var traversables = this._typeTraversable[schema['type']](schema, json);

        _.forEach(traversables, (traversable) =>
        {
            this._traverse(traversable['schema'], traversable['json']);
        });
    }


    motions: Array<JSON> = [];

    constructor()
    {
        // noop.
    }

    validate(motion: JSON): boolean
    {
        try {
            this._traverse(motion_schema, motion);
        }
        catch (exception)
        {
            return false;
        }

        return true;
    }
} 