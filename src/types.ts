export interface ResultError {
    // A numeric code signifying the type of error. This is arbitrary and should follow application standards
    code: number;
    // An internal, technical description of the error that occured
    reason: string;
    // A user-friendly description of the error (usage is application-specific)
    message: string;
}

export type Result<_Value = undefined, _Error = ResultError> =
    | {
          ok: true;
          value: _Value;
      }
    | {
          ok: false;
          error: _Error;
      };

export type ResultPromise<_Value = undefined, _Error = ResultError> = Promise<Result<_Value, _Error>>;

export class Results {
    static success(v?: undefined): Result<undefined, never>;
    static success<_V>(v: _V): Result<_V, never>;
    static success<_V>(v: _V): Result<_V, never> {
        return { ok: true, value: v };
    }

    static error(e?: undefined): Result<never, undefined>;
    static error<_E = ResultError>(e: _E): Result<never, _E>;
    static error<_E = ResultError>(e: _E): Result<never, _E> {
        return { ok: false, error: e };
    }

    static async resolve<_V>(result: Result<_V, unknown> | ResultPromise<_V, unknown>): Promise<_V> {
        return this.resolveSync(await Promise.resolve(result));
    }

    static resolveSync<_V>(result: Result<_V, unknown>): _V {
        if (!result.ok) throw result.error;
        return result.value;
    }

    private constructor() {}
}
