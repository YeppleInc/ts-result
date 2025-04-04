/**
 * A convenient, out-of-the-box guideline for a structured error for cases where a simple string is insufficient (typically server-side)
 */
export interface ResultError {
    /** A numeric code signifying the type of error. This is arbitrary and should follow application standards */
    code: number;
    /**  An internal, technical description of the error that occured */
    reason: string;
    /**  A user-friendly description of the error (usage is application-specific) */
    message: string;
}
fetch;
/**
 * A container representing the result of an action.
 *
 * If `ok` is true, the action was successful and the value is contained within `value`
 *
 * If `ok` is false, the action was unsuccessful and the error is contained within `error`.
 */
export type Result<_Value = undefined, _Error = string> =
    | {
          ok: true;
          value: _Value;
      }
    | {
          ok: false;
          error: _Error;
      };

// A convenience Promise wrapper around a Result; considering that the majority of use cases for
// Results include promises, this reduces one level of generics
export type ResultPromise<_Value = undefined, _Error = string> = Promise<Result<_Value, _Error>>;

export class Results {
    /**
     * Returns a success result wrapper with an underlying value.
     *
     * @param v the underlying value of the successful result
     */
    static success(v?: undefined): Result<undefined, never>;
    static success<_V>(v: _V): Result<_V, never>;
    static success<_V>(v: _V): Result<_V, never> {
        return { ok: true, value: v };
    }

    /**
     * Returns an unsuccessful result wrapper with an underlying error
     *
     * @param e the underlying error of the unsuccessful result
     */
    static error(e?: undefined): Result<never, undefined>;
    static error<_E>(e: _E): Result<never, _E>;
    static error<_E>(e: _E): Result<never, _E> {
        return { ok: false, error: e };
    }

    /**
     * Resolve a result or a result promise to its value, throwing the result's error if the result is unsuccessful.
     *
     * @param result the wrapped value being resolved
     * @returns the underlying result value
     * @throws the underlying result error, if it exists
     */
    static async resolve<_V>(result: Result<_V, unknown> | ResultPromise<_V, unknown>): Promise<_V> {
        return this.resolveSync(await Promise.resolve(result));
    }

    /**
     * Resolve a result to its value, throwing the result's error if the result is unsuccessful.
     *
     * @param result the wrapped value being resolved
     * @returns the underlying result value
     * @throws the underlying result error, if it exists
     */
    static resolveSync<_V>(result: Result<_V, unknown>): _V {
        if (!result.ok) throw result.error;
        return result.value;
    }

    private constructor() {}
}
