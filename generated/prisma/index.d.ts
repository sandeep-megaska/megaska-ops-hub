
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CustomerProfile
 * 
 */
export type CustomerProfile = $Result.DefaultSelection<Prisma.$CustomerProfilePayload>
/**
 * Model AuthSession
 * 
 */
export type AuthSession = $Result.DefaultSelection<Prisma.$AuthSessionPayload>
/**
 * Model OTPChallenge
 * 
 */
export type OTPChallenge = $Result.DefaultSelection<Prisma.$OTPChallengePayload>
/**
 * Model AuditEvent
 * 
 */
export type AuditEvent = $Result.DefaultSelection<Prisma.$AuditEventPayload>
/**
 * Model OrderActionRequest
 * 
 */
export type OrderActionRequest = $Result.DefaultSelection<Prisma.$OrderActionRequestPayload>
/**
 * Model OrderActionItem
 * 
 */
export type OrderActionItem = $Result.DefaultSelection<Prisma.$OrderActionItemPayload>
/**
 * Model RequestPayment
 * 
 */
export type RequestPayment = $Result.DefaultSelection<Prisma.$RequestPaymentPayload>
/**
 * Model ShipmentTracking
 * 
 */
export type ShipmentTracking = $Result.DefaultSelection<Prisma.$ShipmentTrackingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const RequestType: {
  EXCHANGE: 'EXCHANGE',
  REFUND: 'REFUND',
  CANCELLATION: 'CANCELLATION',
  ISSUE: 'ISSUE'
};

export type RequestType = (typeof RequestType)[keyof typeof RequestType]


export const ExchangeRequestStatus: {
  OPEN: 'OPEN',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PICKUP_PENDING: 'PICKUP_PENDING',
  PICKUP_SCHEDULED: 'PICKUP_SCHEDULED',
  PICKUP_COMPLETED: 'PICKUP_COMPLETED',
  ITEM_RECEIVED: 'ITEM_RECEIVED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REPLACEMENT_PROCESSING: 'REPLACEMENT_PROCESSING',
  REPLACEMENT_SHIPPED: 'REPLACEMENT_SHIPPED',
  CLOSED: 'CLOSED'
};

export type ExchangeRequestStatus = (typeof ExchangeRequestStatus)[keyof typeof ExchangeRequestStatus]


export const PaymentPurpose: {
  REVERSE_PICKUP_FEE: 'REVERSE_PICKUP_FEE'
};

export type PaymentPurpose = (typeof PaymentPurpose)[keyof typeof PaymentPurpose]


export const PaymentProvider: {
  RAZORPAY: 'RAZORPAY'
};

export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider]


export const PaymentStatus: {
  NOT_CREATED: 'NOT_CREATED',
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const ShipmentDirection: {
  REVERSE_PICKUP: 'REVERSE_PICKUP',
  FORWARD_REPLACEMENT: 'FORWARD_REPLACEMENT'
};

export type ShipmentDirection = (typeof ShipmentDirection)[keyof typeof ShipmentDirection]


export const ShipmentStatus: {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED'
};

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus]

}

export type RequestType = $Enums.RequestType

export const RequestType: typeof $Enums.RequestType

export type ExchangeRequestStatus = $Enums.ExchangeRequestStatus

export const ExchangeRequestStatus: typeof $Enums.ExchangeRequestStatus

export type PaymentPurpose = $Enums.PaymentPurpose

export const PaymentPurpose: typeof $Enums.PaymentPurpose

export type PaymentProvider = $Enums.PaymentProvider

export const PaymentProvider: typeof $Enums.PaymentProvider

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type ShipmentDirection = $Enums.ShipmentDirection

export const ShipmentDirection: typeof $Enums.ShipmentDirection

export type ShipmentStatus = $Enums.ShipmentStatus

export const ShipmentStatus: typeof $Enums.ShipmentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more CustomerProfiles
 * const customerProfiles = await prisma.customerProfile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more CustomerProfiles
   * const customerProfiles = await prisma.customerProfile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.customerProfile`: Exposes CRUD operations for the **CustomerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerProfiles
    * const customerProfiles = await prisma.customerProfile.findMany()
    * ```
    */
  get customerProfile(): Prisma.CustomerProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authSession`: Exposes CRUD operations for the **AuthSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthSessions
    * const authSessions = await prisma.authSession.findMany()
    * ```
    */
  get authSession(): Prisma.AuthSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oTPChallenge`: Exposes CRUD operations for the **OTPChallenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OTPChallenges
    * const oTPChallenges = await prisma.oTPChallenge.findMany()
    * ```
    */
  get oTPChallenge(): Prisma.OTPChallengeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditEvent`: Exposes CRUD operations for the **AuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditEvents
    * const auditEvents = await prisma.auditEvent.findMany()
    * ```
    */
  get auditEvent(): Prisma.AuditEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderActionRequest`: Exposes CRUD operations for the **OrderActionRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderActionRequests
    * const orderActionRequests = await prisma.orderActionRequest.findMany()
    * ```
    */
  get orderActionRequest(): Prisma.OrderActionRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderActionItem`: Exposes CRUD operations for the **OrderActionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderActionItems
    * const orderActionItems = await prisma.orderActionItem.findMany()
    * ```
    */
  get orderActionItem(): Prisma.OrderActionItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requestPayment`: Exposes CRUD operations for the **RequestPayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RequestPayments
    * const requestPayments = await prisma.requestPayment.findMany()
    * ```
    */
  get requestPayment(): Prisma.RequestPaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipmentTracking`: Exposes CRUD operations for the **ShipmentTracking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShipmentTrackings
    * const shipmentTrackings = await prisma.shipmentTracking.findMany()
    * ```
    */
  get shipmentTracking(): Prisma.ShipmentTrackingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CustomerProfile: 'CustomerProfile',
    AuthSession: 'AuthSession',
    OTPChallenge: 'OTPChallenge',
    AuditEvent: 'AuditEvent',
    OrderActionRequest: 'OrderActionRequest',
    OrderActionItem: 'OrderActionItem',
    RequestPayment: 'RequestPayment',
    ShipmentTracking: 'ShipmentTracking'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "customerProfile" | "authSession" | "oTPChallenge" | "auditEvent" | "orderActionRequest" | "orderActionItem" | "requestPayment" | "shipmentTracking"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CustomerProfile: {
        payload: Prisma.$CustomerProfilePayload<ExtArgs>
        fields: Prisma.CustomerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>
          }
          findFirst: {
            args: Prisma.CustomerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>
          }
          findMany: {
            args: Prisma.CustomerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>[]
          }
          create: {
            args: Prisma.CustomerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>
          }
          createMany: {
            args: Prisma.CustomerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>[]
          }
          delete: {
            args: Prisma.CustomerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>
          }
          update: {
            args: Prisma.CustomerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>
          }
          deleteMany: {
            args: Prisma.CustomerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>[]
          }
          upsert: {
            args: Prisma.CustomerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerProfilePayload>
          }
          aggregate: {
            args: Prisma.CustomerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerProfile>
          }
          groupBy: {
            args: Prisma.CustomerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerProfileCountAggregateOutputType> | number
          }
        }
      }
      AuthSession: {
        payload: Prisma.$AuthSessionPayload<ExtArgs>
        fields: Prisma.AuthSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findFirst: {
            args: Prisma.AuthSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findMany: {
            args: Prisma.AuthSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          create: {
            args: Prisma.AuthSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          createMany: {
            args: Prisma.AuthSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          delete: {
            args: Prisma.AuthSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          update: {
            args: Prisma.AuthSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          deleteMany: {
            args: Prisma.AuthSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          upsert: {
            args: Prisma.AuthSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          aggregate: {
            args: Prisma.AuthSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthSession>
          }
          groupBy: {
            args: Prisma.AuthSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionCountAggregateOutputType> | number
          }
        }
      }
      OTPChallenge: {
        payload: Prisma.$OTPChallengePayload<ExtArgs>
        fields: Prisma.OTPChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OTPChallengeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OTPChallengeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>
          }
          findFirst: {
            args: Prisma.OTPChallengeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OTPChallengeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>
          }
          findMany: {
            args: Prisma.OTPChallengeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>[]
          }
          create: {
            args: Prisma.OTPChallengeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>
          }
          createMany: {
            args: Prisma.OTPChallengeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OTPChallengeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>[]
          }
          delete: {
            args: Prisma.OTPChallengeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>
          }
          update: {
            args: Prisma.OTPChallengeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>
          }
          deleteMany: {
            args: Prisma.OTPChallengeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OTPChallengeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OTPChallengeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>[]
          }
          upsert: {
            args: Prisma.OTPChallengeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OTPChallengePayload>
          }
          aggregate: {
            args: Prisma.OTPChallengeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOTPChallenge>
          }
          groupBy: {
            args: Prisma.OTPChallengeGroupByArgs<ExtArgs>
            result: $Utils.Optional<OTPChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.OTPChallengeCountArgs<ExtArgs>
            result: $Utils.Optional<OTPChallengeCountAggregateOutputType> | number
          }
        }
      }
      AuditEvent: {
        payload: Prisma.$AuditEventPayload<ExtArgs>
        fields: Prisma.AuditEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findFirst: {
            args: Prisma.AuditEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findMany: {
            args: Prisma.AuditEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          create: {
            args: Prisma.AuditEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          createMany: {
            args: Prisma.AuditEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          delete: {
            args: Prisma.AuditEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          update: {
            args: Prisma.AuditEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          deleteMany: {
            args: Prisma.AuditEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          upsert: {
            args: Prisma.AuditEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          aggregate: {
            args: Prisma.AuditEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditEvent>
          }
          groupBy: {
            args: Prisma.AuditEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditEventCountArgs<ExtArgs>
            result: $Utils.Optional<AuditEventCountAggregateOutputType> | number
          }
        }
      }
      OrderActionRequest: {
        payload: Prisma.$OrderActionRequestPayload<ExtArgs>
        fields: Prisma.OrderActionRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderActionRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderActionRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>
          }
          findFirst: {
            args: Prisma.OrderActionRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderActionRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>
          }
          findMany: {
            args: Prisma.OrderActionRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>[]
          }
          create: {
            args: Prisma.OrderActionRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>
          }
          createMany: {
            args: Prisma.OrderActionRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderActionRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>[]
          }
          delete: {
            args: Prisma.OrderActionRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>
          }
          update: {
            args: Prisma.OrderActionRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>
          }
          deleteMany: {
            args: Prisma.OrderActionRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderActionRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderActionRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>[]
          }
          upsert: {
            args: Prisma.OrderActionRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionRequestPayload>
          }
          aggregate: {
            args: Prisma.OrderActionRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderActionRequest>
          }
          groupBy: {
            args: Prisma.OrderActionRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderActionRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderActionRequestCountArgs<ExtArgs>
            result: $Utils.Optional<OrderActionRequestCountAggregateOutputType> | number
          }
        }
      }
      OrderActionItem: {
        payload: Prisma.$OrderActionItemPayload<ExtArgs>
        fields: Prisma.OrderActionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderActionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderActionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>
          }
          findFirst: {
            args: Prisma.OrderActionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderActionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>
          }
          findMany: {
            args: Prisma.OrderActionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>[]
          }
          create: {
            args: Prisma.OrderActionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>
          }
          createMany: {
            args: Prisma.OrderActionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderActionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>[]
          }
          delete: {
            args: Prisma.OrderActionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>
          }
          update: {
            args: Prisma.OrderActionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>
          }
          deleteMany: {
            args: Prisma.OrderActionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderActionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderActionItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>[]
          }
          upsert: {
            args: Prisma.OrderActionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderActionItemPayload>
          }
          aggregate: {
            args: Prisma.OrderActionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderActionItem>
          }
          groupBy: {
            args: Prisma.OrderActionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderActionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderActionItemCountArgs<ExtArgs>
            result: $Utils.Optional<OrderActionItemCountAggregateOutputType> | number
          }
        }
      }
      RequestPayment: {
        payload: Prisma.$RequestPaymentPayload<ExtArgs>
        fields: Prisma.RequestPaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RequestPaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RequestPaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>
          }
          findFirst: {
            args: Prisma.RequestPaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RequestPaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>
          }
          findMany: {
            args: Prisma.RequestPaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>[]
          }
          create: {
            args: Prisma.RequestPaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>
          }
          createMany: {
            args: Prisma.RequestPaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RequestPaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>[]
          }
          delete: {
            args: Prisma.RequestPaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>
          }
          update: {
            args: Prisma.RequestPaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>
          }
          deleteMany: {
            args: Prisma.RequestPaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RequestPaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RequestPaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>[]
          }
          upsert: {
            args: Prisma.RequestPaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestPaymentPayload>
          }
          aggregate: {
            args: Prisma.RequestPaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequestPayment>
          }
          groupBy: {
            args: Prisma.RequestPaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequestPaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.RequestPaymentCountArgs<ExtArgs>
            result: $Utils.Optional<RequestPaymentCountAggregateOutputType> | number
          }
        }
      }
      ShipmentTracking: {
        payload: Prisma.$ShipmentTrackingPayload<ExtArgs>
        fields: Prisma.ShipmentTrackingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentTrackingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentTrackingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>
          }
          findFirst: {
            args: Prisma.ShipmentTrackingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentTrackingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>
          }
          findMany: {
            args: Prisma.ShipmentTrackingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>[]
          }
          create: {
            args: Prisma.ShipmentTrackingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>
          }
          createMany: {
            args: Prisma.ShipmentTrackingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentTrackingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>[]
          }
          delete: {
            args: Prisma.ShipmentTrackingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>
          }
          update: {
            args: Prisma.ShipmentTrackingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentTrackingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentTrackingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentTrackingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentTrackingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentTrackingPayload>
          }
          aggregate: {
            args: Prisma.ShipmentTrackingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipmentTracking>
          }
          groupBy: {
            args: Prisma.ShipmentTrackingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentTrackingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentTrackingCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentTrackingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    customerProfile?: CustomerProfileOmit
    authSession?: AuthSessionOmit
    oTPChallenge?: OTPChallengeOmit
    auditEvent?: AuditEventOmit
    orderActionRequest?: OrderActionRequestOmit
    orderActionItem?: OrderActionItemOmit
    requestPayment?: RequestPaymentOmit
    shipmentTracking?: ShipmentTrackingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CustomerProfileCountOutputType
   */

  export type CustomerProfileCountOutputType = {
    sessions: number
    otpChallenges: number
    orderActionRequests: number
  }

  export type CustomerProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | CustomerProfileCountOutputTypeCountSessionsArgs
    otpChallenges?: boolean | CustomerProfileCountOutputTypeCountOtpChallengesArgs
    orderActionRequests?: boolean | CustomerProfileCountOutputTypeCountOrderActionRequestsArgs
  }

  // Custom InputTypes
  /**
   * CustomerProfileCountOutputType without action
   */
  export type CustomerProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfileCountOutputType
     */
    select?: CustomerProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerProfileCountOutputType without action
   */
  export type CustomerProfileCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
  }

  /**
   * CustomerProfileCountOutputType without action
   */
  export type CustomerProfileCountOutputTypeCountOtpChallengesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OTPChallengeWhereInput
  }

  /**
   * CustomerProfileCountOutputType without action
   */
  export type CustomerProfileCountOutputTypeCountOrderActionRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderActionRequestWhereInput
  }


  /**
   * Count Type OrderActionRequestCountOutputType
   */

  export type OrderActionRequestCountOutputType = {
    items: number
    payments: number
    shipments: number
  }

  export type OrderActionRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | OrderActionRequestCountOutputTypeCountItemsArgs
    payments?: boolean | OrderActionRequestCountOutputTypeCountPaymentsArgs
    shipments?: boolean | OrderActionRequestCountOutputTypeCountShipmentsArgs
  }

  // Custom InputTypes
  /**
   * OrderActionRequestCountOutputType without action
   */
  export type OrderActionRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequestCountOutputType
     */
    select?: OrderActionRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderActionRequestCountOutputType without action
   */
  export type OrderActionRequestCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderActionItemWhereInput
  }

  /**
   * OrderActionRequestCountOutputType without action
   */
  export type OrderActionRequestCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestPaymentWhereInput
  }

  /**
   * OrderActionRequestCountOutputType without action
   */
  export type OrderActionRequestCountOutputTypeCountShipmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentTrackingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CustomerProfile
   */

  export type AggregateCustomerProfile = {
    _count: CustomerProfileCountAggregateOutputType | null
    _min: CustomerProfileMinAggregateOutputType | null
    _max: CustomerProfileMaxAggregateOutputType | null
  }

  export type CustomerProfileMinAggregateOutputType = {
    id: string | null
    phoneE164: string | null
    fullName: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    stateProvince: string | null
    postalCode: string | null
    countryRegion: string | null
    shopifyCustomerId: string | null
    phoneVerifiedAt: Date | null
    profileCompletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerProfileMaxAggregateOutputType = {
    id: string | null
    phoneE164: string | null
    fullName: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    stateProvince: string | null
    postalCode: string | null
    countryRegion: string | null
    shopifyCustomerId: string | null
    phoneVerifiedAt: Date | null
    profileCompletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerProfileCountAggregateOutputType = {
    id: number
    phoneE164: number
    fullName: number
    firstName: number
    lastName: number
    email: number
    addressLine1: number
    addressLine2: number
    city: number
    stateProvince: number
    postalCode: number
    countryRegion: number
    shopifyCustomerId: number
    phoneVerifiedAt: number
    profileCompletedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerProfileMinAggregateInputType = {
    id?: true
    phoneE164?: true
    fullName?: true
    firstName?: true
    lastName?: true
    email?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    stateProvince?: true
    postalCode?: true
    countryRegion?: true
    shopifyCustomerId?: true
    phoneVerifiedAt?: true
    profileCompletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerProfileMaxAggregateInputType = {
    id?: true
    phoneE164?: true
    fullName?: true
    firstName?: true
    lastName?: true
    email?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    stateProvince?: true
    postalCode?: true
    countryRegion?: true
    shopifyCustomerId?: true
    phoneVerifiedAt?: true
    profileCompletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerProfileCountAggregateInputType = {
    id?: true
    phoneE164?: true
    fullName?: true
    firstName?: true
    lastName?: true
    email?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    stateProvince?: true
    postalCode?: true
    countryRegion?: true
    shopifyCustomerId?: true
    phoneVerifiedAt?: true
    profileCompletedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerProfile to aggregate.
     */
    where?: CustomerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerProfiles to fetch.
     */
    orderBy?: CustomerProfileOrderByWithRelationInput | CustomerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerProfiles
    **/
    _count?: true | CustomerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerProfileMaxAggregateInputType
  }

  export type GetCustomerProfileAggregateType<T extends CustomerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerProfile[P]>
      : GetScalarType<T[P], AggregateCustomerProfile[P]>
  }




  export type CustomerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerProfileWhereInput
    orderBy?: CustomerProfileOrderByWithAggregationInput | CustomerProfileOrderByWithAggregationInput[]
    by: CustomerProfileScalarFieldEnum[] | CustomerProfileScalarFieldEnum
    having?: CustomerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerProfileCountAggregateInputType | true
    _min?: CustomerProfileMinAggregateInputType
    _max?: CustomerProfileMaxAggregateInputType
  }

  export type CustomerProfileGroupByOutputType = {
    id: string
    phoneE164: string
    fullName: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    stateProvince: string | null
    postalCode: string | null
    countryRegion: string | null
    shopifyCustomerId: string | null
    phoneVerifiedAt: Date | null
    profileCompletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerProfileCountAggregateOutputType | null
    _min: CustomerProfileMinAggregateOutputType | null
    _max: CustomerProfileMaxAggregateOutputType | null
  }

  type GetCustomerProfileGroupByPayload<T extends CustomerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerProfileGroupByOutputType[P]>
        }
      >
    >


  export type CustomerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneE164?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    stateProvince?: boolean
    postalCode?: boolean
    countryRegion?: boolean
    shopifyCustomerId?: boolean
    phoneVerifiedAt?: boolean
    profileCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | CustomerProfile$sessionsArgs<ExtArgs>
    otpChallenges?: boolean | CustomerProfile$otpChallengesArgs<ExtArgs>
    orderActionRequests?: boolean | CustomerProfile$orderActionRequestsArgs<ExtArgs>
    _count?: boolean | CustomerProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerProfile"]>

  export type CustomerProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneE164?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    stateProvince?: boolean
    postalCode?: boolean
    countryRegion?: boolean
    shopifyCustomerId?: boolean
    phoneVerifiedAt?: boolean
    profileCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customerProfile"]>

  export type CustomerProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneE164?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    stateProvince?: boolean
    postalCode?: boolean
    countryRegion?: boolean
    shopifyCustomerId?: boolean
    phoneVerifiedAt?: boolean
    profileCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customerProfile"]>

  export type CustomerProfileSelectScalar = {
    id?: boolean
    phoneE164?: boolean
    fullName?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    stateProvince?: boolean
    postalCode?: boolean
    countryRegion?: boolean
    shopifyCustomerId?: boolean
    phoneVerifiedAt?: boolean
    profileCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phoneE164" | "fullName" | "firstName" | "lastName" | "email" | "addressLine1" | "addressLine2" | "city" | "stateProvince" | "postalCode" | "countryRegion" | "shopifyCustomerId" | "phoneVerifiedAt" | "profileCompletedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["customerProfile"]>
  export type CustomerProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | CustomerProfile$sessionsArgs<ExtArgs>
    otpChallenges?: boolean | CustomerProfile$otpChallengesArgs<ExtArgs>
    orderActionRequests?: boolean | CustomerProfile$orderActionRequestsArgs<ExtArgs>
    _count?: boolean | CustomerProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CustomerProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerProfile"
    objects: {
      sessions: Prisma.$AuthSessionPayload<ExtArgs>[]
      otpChallenges: Prisma.$OTPChallengePayload<ExtArgs>[]
      orderActionRequests: Prisma.$OrderActionRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phoneE164: string
      fullName: string | null
      firstName: string | null
      lastName: string | null
      email: string | null
      addressLine1: string | null
      addressLine2: string | null
      city: string | null
      stateProvince: string | null
      postalCode: string | null
      countryRegion: string | null
      shopifyCustomerId: string | null
      phoneVerifiedAt: Date | null
      profileCompletedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customerProfile"]>
    composites: {}
  }

  type CustomerProfileGetPayload<S extends boolean | null | undefined | CustomerProfileDefaultArgs> = $Result.GetResult<Prisma.$CustomerProfilePayload, S>

  type CustomerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerProfileCountAggregateInputType | true
    }

  export interface CustomerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerProfile'], meta: { name: 'CustomerProfile' } }
    /**
     * Find zero or one CustomerProfile that matches the filter.
     * @param {CustomerProfileFindUniqueArgs} args - Arguments to find a CustomerProfile
     * @example
     * // Get one CustomerProfile
     * const customerProfile = await prisma.customerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerProfileFindUniqueArgs>(args: SelectSubset<T, CustomerProfileFindUniqueArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerProfileFindUniqueOrThrowArgs} args - Arguments to find a CustomerProfile
     * @example
     * // Get one CustomerProfile
     * const customerProfile = await prisma.customerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileFindFirstArgs} args - Arguments to find a CustomerProfile
     * @example
     * // Get one CustomerProfile
     * const customerProfile = await prisma.customerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerProfileFindFirstArgs>(args?: SelectSubset<T, CustomerProfileFindFirstArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileFindFirstOrThrowArgs} args - Arguments to find a CustomerProfile
     * @example
     * // Get one CustomerProfile
     * const customerProfile = await prisma.customerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerProfiles
     * const customerProfiles = await prisma.customerProfile.findMany()
     * 
     * // Get first 10 CustomerProfiles
     * const customerProfiles = await prisma.customerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerProfileWithIdOnly = await prisma.customerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerProfileFindManyArgs>(args?: SelectSubset<T, CustomerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerProfile.
     * @param {CustomerProfileCreateArgs} args - Arguments to create a CustomerProfile.
     * @example
     * // Create one CustomerProfile
     * const CustomerProfile = await prisma.customerProfile.create({
     *   data: {
     *     // ... data to create a CustomerProfile
     *   }
     * })
     * 
     */
    create<T extends CustomerProfileCreateArgs>(args: SelectSubset<T, CustomerProfileCreateArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerProfiles.
     * @param {CustomerProfileCreateManyArgs} args - Arguments to create many CustomerProfiles.
     * @example
     * // Create many CustomerProfiles
     * const customerProfile = await prisma.customerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerProfileCreateManyArgs>(args?: SelectSubset<T, CustomerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomerProfiles and returns the data saved in the database.
     * @param {CustomerProfileCreateManyAndReturnArgs} args - Arguments to create many CustomerProfiles.
     * @example
     * // Create many CustomerProfiles
     * const customerProfile = await prisma.customerProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomerProfiles and only return the `id`
     * const customerProfileWithIdOnly = await prisma.customerProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomerProfile.
     * @param {CustomerProfileDeleteArgs} args - Arguments to delete one CustomerProfile.
     * @example
     * // Delete one CustomerProfile
     * const CustomerProfile = await prisma.customerProfile.delete({
     *   where: {
     *     // ... filter to delete one CustomerProfile
     *   }
     * })
     * 
     */
    delete<T extends CustomerProfileDeleteArgs>(args: SelectSubset<T, CustomerProfileDeleteArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerProfile.
     * @param {CustomerProfileUpdateArgs} args - Arguments to update one CustomerProfile.
     * @example
     * // Update one CustomerProfile
     * const customerProfile = await prisma.customerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerProfileUpdateArgs>(args: SelectSubset<T, CustomerProfileUpdateArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerProfiles.
     * @param {CustomerProfileDeleteManyArgs} args - Arguments to filter CustomerProfiles to delete.
     * @example
     * // Delete a few CustomerProfiles
     * const { count } = await prisma.customerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerProfileDeleteManyArgs>(args?: SelectSubset<T, CustomerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerProfiles
     * const customerProfile = await prisma.customerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerProfileUpdateManyArgs>(args: SelectSubset<T, CustomerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerProfiles and returns the data updated in the database.
     * @param {CustomerProfileUpdateManyAndReturnArgs} args - Arguments to update many CustomerProfiles.
     * @example
     * // Update many CustomerProfiles
     * const customerProfile = await prisma.customerProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomerProfiles and only return the `id`
     * const customerProfileWithIdOnly = await prisma.customerProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomerProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomerProfile.
     * @param {CustomerProfileUpsertArgs} args - Arguments to update or create a CustomerProfile.
     * @example
     * // Update or create a CustomerProfile
     * const customerProfile = await prisma.customerProfile.upsert({
     *   create: {
     *     // ... data to create a CustomerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerProfile we want to update
     *   }
     * })
     */
    upsert<T extends CustomerProfileUpsertArgs>(args: SelectSubset<T, CustomerProfileUpsertArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileCountArgs} args - Arguments to filter CustomerProfiles to count.
     * @example
     * // Count the number of CustomerProfiles
     * const count = await prisma.customerProfile.count({
     *   where: {
     *     // ... the filter for the CustomerProfiles we want to count
     *   }
     * })
    **/
    count<T extends CustomerProfileCountArgs>(
      args?: Subset<T, CustomerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerProfileAggregateArgs>(args: Subset<T, CustomerProfileAggregateArgs>): Prisma.PrismaPromise<GetCustomerProfileAggregateType<T>>

    /**
     * Group by CustomerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerProfileGroupByArgs['orderBy'] }
        : { orderBy?: CustomerProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerProfile model
   */
  readonly fields: CustomerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends CustomerProfile$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, CustomerProfile$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    otpChallenges<T extends CustomerProfile$otpChallengesArgs<ExtArgs> = {}>(args?: Subset<T, CustomerProfile$otpChallengesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orderActionRequests<T extends CustomerProfile$orderActionRequestsArgs<ExtArgs> = {}>(args?: Subset<T, CustomerProfile$orderActionRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomerProfile model
   */
  interface CustomerProfileFieldRefs {
    readonly id: FieldRef<"CustomerProfile", 'String'>
    readonly phoneE164: FieldRef<"CustomerProfile", 'String'>
    readonly fullName: FieldRef<"CustomerProfile", 'String'>
    readonly firstName: FieldRef<"CustomerProfile", 'String'>
    readonly lastName: FieldRef<"CustomerProfile", 'String'>
    readonly email: FieldRef<"CustomerProfile", 'String'>
    readonly addressLine1: FieldRef<"CustomerProfile", 'String'>
    readonly addressLine2: FieldRef<"CustomerProfile", 'String'>
    readonly city: FieldRef<"CustomerProfile", 'String'>
    readonly stateProvince: FieldRef<"CustomerProfile", 'String'>
    readonly postalCode: FieldRef<"CustomerProfile", 'String'>
    readonly countryRegion: FieldRef<"CustomerProfile", 'String'>
    readonly shopifyCustomerId: FieldRef<"CustomerProfile", 'String'>
    readonly phoneVerifiedAt: FieldRef<"CustomerProfile", 'DateTime'>
    readonly profileCompletedAt: FieldRef<"CustomerProfile", 'DateTime'>
    readonly createdAt: FieldRef<"CustomerProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"CustomerProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerProfile findUnique
   */
  export type CustomerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CustomerProfile to fetch.
     */
    where: CustomerProfileWhereUniqueInput
  }

  /**
   * CustomerProfile findUniqueOrThrow
   */
  export type CustomerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CustomerProfile to fetch.
     */
    where: CustomerProfileWhereUniqueInput
  }

  /**
   * CustomerProfile findFirst
   */
  export type CustomerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CustomerProfile to fetch.
     */
    where?: CustomerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerProfiles to fetch.
     */
    orderBy?: CustomerProfileOrderByWithRelationInput | CustomerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerProfiles.
     */
    cursor?: CustomerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerProfiles.
     */
    distinct?: CustomerProfileScalarFieldEnum | CustomerProfileScalarFieldEnum[]
  }

  /**
   * CustomerProfile findFirstOrThrow
   */
  export type CustomerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CustomerProfile to fetch.
     */
    where?: CustomerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerProfiles to fetch.
     */
    orderBy?: CustomerProfileOrderByWithRelationInput | CustomerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerProfiles.
     */
    cursor?: CustomerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerProfiles.
     */
    distinct?: CustomerProfileScalarFieldEnum | CustomerProfileScalarFieldEnum[]
  }

  /**
   * CustomerProfile findMany
   */
  export type CustomerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CustomerProfiles to fetch.
     */
    where?: CustomerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerProfiles to fetch.
     */
    orderBy?: CustomerProfileOrderByWithRelationInput | CustomerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerProfiles.
     */
    cursor?: CustomerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerProfiles.
     */
    distinct?: CustomerProfileScalarFieldEnum | CustomerProfileScalarFieldEnum[]
  }

  /**
   * CustomerProfile create
   */
  export type CustomerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerProfile.
     */
    data: XOR<CustomerProfileCreateInput, CustomerProfileUncheckedCreateInput>
  }

  /**
   * CustomerProfile createMany
   */
  export type CustomerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerProfiles.
     */
    data: CustomerProfileCreateManyInput | CustomerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerProfile createManyAndReturn
   */
  export type CustomerProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * The data used to create many CustomerProfiles.
     */
    data: CustomerProfileCreateManyInput | CustomerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerProfile update
   */
  export type CustomerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerProfile.
     */
    data: XOR<CustomerProfileUpdateInput, CustomerProfileUncheckedUpdateInput>
    /**
     * Choose, which CustomerProfile to update.
     */
    where: CustomerProfileWhereUniqueInput
  }

  /**
   * CustomerProfile updateMany
   */
  export type CustomerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerProfiles.
     */
    data: XOR<CustomerProfileUpdateManyMutationInput, CustomerProfileUncheckedUpdateManyInput>
    /**
     * Filter which CustomerProfiles to update
     */
    where?: CustomerProfileWhereInput
    /**
     * Limit how many CustomerProfiles to update.
     */
    limit?: number
  }

  /**
   * CustomerProfile updateManyAndReturn
   */
  export type CustomerProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * The data used to update CustomerProfiles.
     */
    data: XOR<CustomerProfileUpdateManyMutationInput, CustomerProfileUncheckedUpdateManyInput>
    /**
     * Filter which CustomerProfiles to update
     */
    where?: CustomerProfileWhereInput
    /**
     * Limit how many CustomerProfiles to update.
     */
    limit?: number
  }

  /**
   * CustomerProfile upsert
   */
  export type CustomerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerProfile to update in case it exists.
     */
    where: CustomerProfileWhereUniqueInput
    /**
     * In case the CustomerProfile found by the `where` argument doesn't exist, create a new CustomerProfile with this data.
     */
    create: XOR<CustomerProfileCreateInput, CustomerProfileUncheckedCreateInput>
    /**
     * In case the CustomerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerProfileUpdateInput, CustomerProfileUncheckedUpdateInput>
  }

  /**
   * CustomerProfile delete
   */
  export type CustomerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    /**
     * Filter which CustomerProfile to delete.
     */
    where: CustomerProfileWhereUniqueInput
  }

  /**
   * CustomerProfile deleteMany
   */
  export type CustomerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerProfiles to delete
     */
    where?: CustomerProfileWhereInput
    /**
     * Limit how many CustomerProfiles to delete.
     */
    limit?: number
  }

  /**
   * CustomerProfile.sessions
   */
  export type CustomerProfile$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    cursor?: AuthSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * CustomerProfile.otpChallenges
   */
  export type CustomerProfile$otpChallengesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    where?: OTPChallengeWhereInput
    orderBy?: OTPChallengeOrderByWithRelationInput | OTPChallengeOrderByWithRelationInput[]
    cursor?: OTPChallengeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OTPChallengeScalarFieldEnum | OTPChallengeScalarFieldEnum[]
  }

  /**
   * CustomerProfile.orderActionRequests
   */
  export type CustomerProfile$orderActionRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    where?: OrderActionRequestWhereInput
    orderBy?: OrderActionRequestOrderByWithRelationInput | OrderActionRequestOrderByWithRelationInput[]
    cursor?: OrderActionRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderActionRequestScalarFieldEnum | OrderActionRequestScalarFieldEnum[]
  }

  /**
   * CustomerProfile without action
   */
  export type CustomerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
  }


  /**
   * Model AuthSession
   */

  export type AggregateAuthSession = {
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  export type AuthSessionMinAggregateOutputType = {
    id: string | null
    customerProfileId: string | null
    sessionTokenHash: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthSessionMaxAggregateOutputType = {
    id: string | null
    customerProfileId: string | null
    sessionTokenHash: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthSessionCountAggregateOutputType = {
    id: number
    customerProfileId: number
    sessionTokenHash: number
    expiresAt: number
    revokedAt: number
    lastSeenAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthSessionMinAggregateInputType = {
    id?: true
    customerProfileId?: true
    sessionTokenHash?: true
    expiresAt?: true
    revokedAt?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthSessionMaxAggregateInputType = {
    id?: true
    customerProfileId?: true
    sessionTokenHash?: true
    expiresAt?: true
    revokedAt?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthSessionCountAggregateInputType = {
    id?: true
    customerProfileId?: true
    sessionTokenHash?: true
    expiresAt?: true
    revokedAt?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSession to aggregate.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthSessions
    **/
    _count?: true | AuthSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthSessionMaxAggregateInputType
  }

  export type GetAuthSessionAggregateType<T extends AuthSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthSession[P]>
      : GetScalarType<T[P], AggregateAuthSession[P]>
  }




  export type AuthSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithAggregationInput | AuthSessionOrderByWithAggregationInput[]
    by: AuthSessionScalarFieldEnum[] | AuthSessionScalarFieldEnum
    having?: AuthSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthSessionCountAggregateInputType | true
    _min?: AuthSessionMinAggregateInputType
    _max?: AuthSessionMaxAggregateInputType
  }

  export type AuthSessionGroupByOutputType = {
    id: string
    customerProfileId: string
    sessionTokenHash: string
    expiresAt: Date
    revokedAt: Date | null
    lastSeenAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  type GetAuthSessionGroupByPayload<T extends AuthSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
        }
      >
    >


  export type AuthSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerProfileId?: boolean
    sessionTokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerProfileId?: boolean
    sessionTokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerProfileId?: boolean
    sessionTokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectScalar = {
    id?: boolean
    customerProfileId?: boolean
    sessionTokenHash?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerProfileId" | "sessionTokenHash" | "expiresAt" | "revokedAt" | "lastSeenAt" | "createdAt" | "updatedAt", ExtArgs["result"]["authSession"]>
  export type AuthSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }

  export type $AuthSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthSession"
    objects: {
      customer: Prisma.$CustomerProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerProfileId: string
      sessionTokenHash: string
      expiresAt: Date
      revokedAt: Date | null
      lastSeenAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authSession"]>
    composites: {}
  }

  type AuthSessionGetPayload<S extends boolean | null | undefined | AuthSessionDefaultArgs> = $Result.GetResult<Prisma.$AuthSessionPayload, S>

  type AuthSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthSessionCountAggregateInputType | true
    }

  export interface AuthSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthSession'], meta: { name: 'AuthSession' } }
    /**
     * Find zero or one AuthSession that matches the filter.
     * @param {AuthSessionFindUniqueArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthSessionFindUniqueArgs>(args: SelectSubset<T, AuthSessionFindUniqueArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthSessionFindUniqueOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthSessionFindFirstArgs>(args?: SelectSubset<T, AuthSessionFindFirstArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthSessions
     * const authSessions = await prisma.authSession.findMany()
     * 
     * // Get first 10 AuthSessions
     * const authSessions = await prisma.authSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authSessionWithIdOnly = await prisma.authSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthSessionFindManyArgs>(args?: SelectSubset<T, AuthSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthSession.
     * @param {AuthSessionCreateArgs} args - Arguments to create a AuthSession.
     * @example
     * // Create one AuthSession
     * const AuthSession = await prisma.authSession.create({
     *   data: {
     *     // ... data to create a AuthSession
     *   }
     * })
     * 
     */
    create<T extends AuthSessionCreateArgs>(args: SelectSubset<T, AuthSessionCreateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthSessions.
     * @param {AuthSessionCreateManyArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthSessionCreateManyArgs>(args?: SelectSubset<T, AuthSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthSessions and returns the data saved in the database.
     * @param {AuthSessionCreateManyAndReturnArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthSession.
     * @param {AuthSessionDeleteArgs} args - Arguments to delete one AuthSession.
     * @example
     * // Delete one AuthSession
     * const AuthSession = await prisma.authSession.delete({
     *   where: {
     *     // ... filter to delete one AuthSession
     *   }
     * })
     * 
     */
    delete<T extends AuthSessionDeleteArgs>(args: SelectSubset<T, AuthSessionDeleteArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthSession.
     * @param {AuthSessionUpdateArgs} args - Arguments to update one AuthSession.
     * @example
     * // Update one AuthSession
     * const authSession = await prisma.authSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthSessionUpdateArgs>(args: SelectSubset<T, AuthSessionUpdateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthSessions.
     * @param {AuthSessionDeleteManyArgs} args - Arguments to filter AuthSessions to delete.
     * @example
     * // Delete a few AuthSessions
     * const { count } = await prisma.authSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthSessionDeleteManyArgs>(args?: SelectSubset<T, AuthSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthSessionUpdateManyArgs>(args: SelectSubset<T, AuthSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions and returns the data updated in the database.
     * @param {AuthSessionUpdateManyAndReturnArgs} args - Arguments to update many AuthSessions.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthSession.
     * @param {AuthSessionUpsertArgs} args - Arguments to update or create a AuthSession.
     * @example
     * // Update or create a AuthSession
     * const authSession = await prisma.authSession.upsert({
     *   create: {
     *     // ... data to create a AuthSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthSession we want to update
     *   }
     * })
     */
    upsert<T extends AuthSessionUpsertArgs>(args: SelectSubset<T, AuthSessionUpsertArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionCountArgs} args - Arguments to filter AuthSessions to count.
     * @example
     * // Count the number of AuthSessions
     * const count = await prisma.authSession.count({
     *   where: {
     *     // ... the filter for the AuthSessions we want to count
     *   }
     * })
    **/
    count<T extends AuthSessionCountArgs>(
      args?: Subset<T, AuthSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthSessionAggregateArgs>(args: Subset<T, AuthSessionAggregateArgs>): Prisma.PrismaPromise<GetAuthSessionAggregateType<T>>

    /**
     * Group by AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthSessionGroupByArgs['orderBy'] }
        : { orderBy?: AuthSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthSession model
   */
  readonly fields: AuthSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerProfileDefaultArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthSession model
   */
  interface AuthSessionFieldRefs {
    readonly id: FieldRef<"AuthSession", 'String'>
    readonly customerProfileId: FieldRef<"AuthSession", 'String'>
    readonly sessionTokenHash: FieldRef<"AuthSession", 'String'>
    readonly expiresAt: FieldRef<"AuthSession", 'DateTime'>
    readonly revokedAt: FieldRef<"AuthSession", 'DateTime'>
    readonly lastSeenAt: FieldRef<"AuthSession", 'DateTime'>
    readonly createdAt: FieldRef<"AuthSession", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthSession findUnique
   */
  export type AuthSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findUniqueOrThrow
   */
  export type AuthSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findFirst
   */
  export type AuthSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findFirstOrThrow
   */
  export type AuthSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findMany
   */
  export type AuthSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSessions to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession create
   */
  export type AuthSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthSession.
     */
    data: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
  }

  /**
   * AuthSession createMany
   */
  export type AuthSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthSession createManyAndReturn
   */
  export type AuthSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession update
   */
  export type AuthSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthSession.
     */
    data: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
    /**
     * Choose, which AuthSession to update.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession updateMany
   */
  export type AuthSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
  }

  /**
   * AuthSession updateManyAndReturn
   */
  export type AuthSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession upsert
   */
  export type AuthSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthSession to update in case it exists.
     */
    where: AuthSessionWhereUniqueInput
    /**
     * In case the AuthSession found by the `where` argument doesn't exist, create a new AuthSession with this data.
     */
    create: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
    /**
     * In case the AuthSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
  }

  /**
   * AuthSession delete
   */
  export type AuthSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter which AuthSession to delete.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession deleteMany
   */
  export type AuthSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSessions to delete
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to delete.
     */
    limit?: number
  }

  /**
   * AuthSession without action
   */
  export type AuthSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
  }


  /**
   * Model OTPChallenge
   */

  export type AggregateOTPChallenge = {
    _count: OTPChallengeCountAggregateOutputType | null
    _avg: OTPChallengeAvgAggregateOutputType | null
    _sum: OTPChallengeSumAggregateOutputType | null
    _min: OTPChallengeMinAggregateOutputType | null
    _max: OTPChallengeMaxAggregateOutputType | null
  }

  export type OTPChallengeAvgAggregateOutputType = {
    attemptsCount: number | null
  }

  export type OTPChallengeSumAggregateOutputType = {
    attemptsCount: number | null
  }

  export type OTPChallengeMinAggregateOutputType = {
    id: string | null
    phoneE164: string | null
    provider: string | null
    providerSid: string | null
    status: string | null
    attemptsCount: number | null
    requestedAt: Date | null
    verifiedAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    customerProfileId: string | null
  }

  export type OTPChallengeMaxAggregateOutputType = {
    id: string | null
    phoneE164: string | null
    provider: string | null
    providerSid: string | null
    status: string | null
    attemptsCount: number | null
    requestedAt: Date | null
    verifiedAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    customerProfileId: string | null
  }

  export type OTPChallengeCountAggregateOutputType = {
    id: number
    phoneE164: number
    provider: number
    providerSid: number
    status: number
    attemptsCount: number
    requestedAt: number
    verifiedAt: number
    expiresAt: number
    metadata: number
    createdAt: number
    customerProfileId: number
    _all: number
  }


  export type OTPChallengeAvgAggregateInputType = {
    attemptsCount?: true
  }

  export type OTPChallengeSumAggregateInputType = {
    attemptsCount?: true
  }

  export type OTPChallengeMinAggregateInputType = {
    id?: true
    phoneE164?: true
    provider?: true
    providerSid?: true
    status?: true
    attemptsCount?: true
    requestedAt?: true
    verifiedAt?: true
    expiresAt?: true
    createdAt?: true
    customerProfileId?: true
  }

  export type OTPChallengeMaxAggregateInputType = {
    id?: true
    phoneE164?: true
    provider?: true
    providerSid?: true
    status?: true
    attemptsCount?: true
    requestedAt?: true
    verifiedAt?: true
    expiresAt?: true
    createdAt?: true
    customerProfileId?: true
  }

  export type OTPChallengeCountAggregateInputType = {
    id?: true
    phoneE164?: true
    provider?: true
    providerSid?: true
    status?: true
    attemptsCount?: true
    requestedAt?: true
    verifiedAt?: true
    expiresAt?: true
    metadata?: true
    createdAt?: true
    customerProfileId?: true
    _all?: true
  }

  export type OTPChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OTPChallenge to aggregate.
     */
    where?: OTPChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPChallenges to fetch.
     */
    orderBy?: OTPChallengeOrderByWithRelationInput | OTPChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OTPChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OTPChallenges
    **/
    _count?: true | OTPChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OTPChallengeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OTPChallengeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OTPChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OTPChallengeMaxAggregateInputType
  }

  export type GetOTPChallengeAggregateType<T extends OTPChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregateOTPChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOTPChallenge[P]>
      : GetScalarType<T[P], AggregateOTPChallenge[P]>
  }




  export type OTPChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OTPChallengeWhereInput
    orderBy?: OTPChallengeOrderByWithAggregationInput | OTPChallengeOrderByWithAggregationInput[]
    by: OTPChallengeScalarFieldEnum[] | OTPChallengeScalarFieldEnum
    having?: OTPChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OTPChallengeCountAggregateInputType | true
    _avg?: OTPChallengeAvgAggregateInputType
    _sum?: OTPChallengeSumAggregateInputType
    _min?: OTPChallengeMinAggregateInputType
    _max?: OTPChallengeMaxAggregateInputType
  }

  export type OTPChallengeGroupByOutputType = {
    id: string
    phoneE164: string
    provider: string
    providerSid: string | null
    status: string
    attemptsCount: number
    requestedAt: Date
    verifiedAt: Date | null
    expiresAt: Date
    metadata: JsonValue | null
    createdAt: Date
    customerProfileId: string | null
    _count: OTPChallengeCountAggregateOutputType | null
    _avg: OTPChallengeAvgAggregateOutputType | null
    _sum: OTPChallengeSumAggregateOutputType | null
    _min: OTPChallengeMinAggregateOutputType | null
    _max: OTPChallengeMaxAggregateOutputType | null
  }

  type GetOTPChallengeGroupByPayload<T extends OTPChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OTPChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OTPChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OTPChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], OTPChallengeGroupByOutputType[P]>
        }
      >
    >


  export type OTPChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneE164?: boolean
    provider?: boolean
    providerSid?: boolean
    status?: boolean
    attemptsCount?: boolean
    requestedAt?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    customerProfileId?: boolean
    customer?: boolean | OTPChallenge$customerArgs<ExtArgs>
  }, ExtArgs["result"]["oTPChallenge"]>

  export type OTPChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneE164?: boolean
    provider?: boolean
    providerSid?: boolean
    status?: boolean
    attemptsCount?: boolean
    requestedAt?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    customerProfileId?: boolean
    customer?: boolean | OTPChallenge$customerArgs<ExtArgs>
  }, ExtArgs["result"]["oTPChallenge"]>

  export type OTPChallengeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneE164?: boolean
    provider?: boolean
    providerSid?: boolean
    status?: boolean
    attemptsCount?: boolean
    requestedAt?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    customerProfileId?: boolean
    customer?: boolean | OTPChallenge$customerArgs<ExtArgs>
  }, ExtArgs["result"]["oTPChallenge"]>

  export type OTPChallengeSelectScalar = {
    id?: boolean
    phoneE164?: boolean
    provider?: boolean
    providerSid?: boolean
    status?: boolean
    attemptsCount?: boolean
    requestedAt?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    customerProfileId?: boolean
  }

  export type OTPChallengeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phoneE164" | "provider" | "providerSid" | "status" | "attemptsCount" | "requestedAt" | "verifiedAt" | "expiresAt" | "metadata" | "createdAt" | "customerProfileId", ExtArgs["result"]["oTPChallenge"]>
  export type OTPChallengeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | OTPChallenge$customerArgs<ExtArgs>
  }
  export type OTPChallengeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | OTPChallenge$customerArgs<ExtArgs>
  }
  export type OTPChallengeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | OTPChallenge$customerArgs<ExtArgs>
  }

  export type $OTPChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OTPChallenge"
    objects: {
      customer: Prisma.$CustomerProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phoneE164: string
      provider: string
      providerSid: string | null
      status: string
      attemptsCount: number
      requestedAt: Date
      verifiedAt: Date | null
      expiresAt: Date
      metadata: Prisma.JsonValue | null
      createdAt: Date
      customerProfileId: string | null
    }, ExtArgs["result"]["oTPChallenge"]>
    composites: {}
  }

  type OTPChallengeGetPayload<S extends boolean | null | undefined | OTPChallengeDefaultArgs> = $Result.GetResult<Prisma.$OTPChallengePayload, S>

  type OTPChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OTPChallengeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OTPChallengeCountAggregateInputType | true
    }

  export interface OTPChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OTPChallenge'], meta: { name: 'OTPChallenge' } }
    /**
     * Find zero or one OTPChallenge that matches the filter.
     * @param {OTPChallengeFindUniqueArgs} args - Arguments to find a OTPChallenge
     * @example
     * // Get one OTPChallenge
     * const oTPChallenge = await prisma.oTPChallenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OTPChallengeFindUniqueArgs>(args: SelectSubset<T, OTPChallengeFindUniqueArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OTPChallenge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OTPChallengeFindUniqueOrThrowArgs} args - Arguments to find a OTPChallenge
     * @example
     * // Get one OTPChallenge
     * const oTPChallenge = await prisma.oTPChallenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OTPChallengeFindUniqueOrThrowArgs>(args: SelectSubset<T, OTPChallengeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OTPChallenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeFindFirstArgs} args - Arguments to find a OTPChallenge
     * @example
     * // Get one OTPChallenge
     * const oTPChallenge = await prisma.oTPChallenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OTPChallengeFindFirstArgs>(args?: SelectSubset<T, OTPChallengeFindFirstArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OTPChallenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeFindFirstOrThrowArgs} args - Arguments to find a OTPChallenge
     * @example
     * // Get one OTPChallenge
     * const oTPChallenge = await prisma.oTPChallenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OTPChallengeFindFirstOrThrowArgs>(args?: SelectSubset<T, OTPChallengeFindFirstOrThrowArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OTPChallenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OTPChallenges
     * const oTPChallenges = await prisma.oTPChallenge.findMany()
     * 
     * // Get first 10 OTPChallenges
     * const oTPChallenges = await prisma.oTPChallenge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oTPChallengeWithIdOnly = await prisma.oTPChallenge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OTPChallengeFindManyArgs>(args?: SelectSubset<T, OTPChallengeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OTPChallenge.
     * @param {OTPChallengeCreateArgs} args - Arguments to create a OTPChallenge.
     * @example
     * // Create one OTPChallenge
     * const OTPChallenge = await prisma.oTPChallenge.create({
     *   data: {
     *     // ... data to create a OTPChallenge
     *   }
     * })
     * 
     */
    create<T extends OTPChallengeCreateArgs>(args: SelectSubset<T, OTPChallengeCreateArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OTPChallenges.
     * @param {OTPChallengeCreateManyArgs} args - Arguments to create many OTPChallenges.
     * @example
     * // Create many OTPChallenges
     * const oTPChallenge = await prisma.oTPChallenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OTPChallengeCreateManyArgs>(args?: SelectSubset<T, OTPChallengeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OTPChallenges and returns the data saved in the database.
     * @param {OTPChallengeCreateManyAndReturnArgs} args - Arguments to create many OTPChallenges.
     * @example
     * // Create many OTPChallenges
     * const oTPChallenge = await prisma.oTPChallenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OTPChallenges and only return the `id`
     * const oTPChallengeWithIdOnly = await prisma.oTPChallenge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OTPChallengeCreateManyAndReturnArgs>(args?: SelectSubset<T, OTPChallengeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OTPChallenge.
     * @param {OTPChallengeDeleteArgs} args - Arguments to delete one OTPChallenge.
     * @example
     * // Delete one OTPChallenge
     * const OTPChallenge = await prisma.oTPChallenge.delete({
     *   where: {
     *     // ... filter to delete one OTPChallenge
     *   }
     * })
     * 
     */
    delete<T extends OTPChallengeDeleteArgs>(args: SelectSubset<T, OTPChallengeDeleteArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OTPChallenge.
     * @param {OTPChallengeUpdateArgs} args - Arguments to update one OTPChallenge.
     * @example
     * // Update one OTPChallenge
     * const oTPChallenge = await prisma.oTPChallenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OTPChallengeUpdateArgs>(args: SelectSubset<T, OTPChallengeUpdateArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OTPChallenges.
     * @param {OTPChallengeDeleteManyArgs} args - Arguments to filter OTPChallenges to delete.
     * @example
     * // Delete a few OTPChallenges
     * const { count } = await prisma.oTPChallenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OTPChallengeDeleteManyArgs>(args?: SelectSubset<T, OTPChallengeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OTPChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OTPChallenges
     * const oTPChallenge = await prisma.oTPChallenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OTPChallengeUpdateManyArgs>(args: SelectSubset<T, OTPChallengeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OTPChallenges and returns the data updated in the database.
     * @param {OTPChallengeUpdateManyAndReturnArgs} args - Arguments to update many OTPChallenges.
     * @example
     * // Update many OTPChallenges
     * const oTPChallenge = await prisma.oTPChallenge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OTPChallenges and only return the `id`
     * const oTPChallengeWithIdOnly = await prisma.oTPChallenge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OTPChallengeUpdateManyAndReturnArgs>(args: SelectSubset<T, OTPChallengeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OTPChallenge.
     * @param {OTPChallengeUpsertArgs} args - Arguments to update or create a OTPChallenge.
     * @example
     * // Update or create a OTPChallenge
     * const oTPChallenge = await prisma.oTPChallenge.upsert({
     *   create: {
     *     // ... data to create a OTPChallenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OTPChallenge we want to update
     *   }
     * })
     */
    upsert<T extends OTPChallengeUpsertArgs>(args: SelectSubset<T, OTPChallengeUpsertArgs<ExtArgs>>): Prisma__OTPChallengeClient<$Result.GetResult<Prisma.$OTPChallengePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OTPChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeCountArgs} args - Arguments to filter OTPChallenges to count.
     * @example
     * // Count the number of OTPChallenges
     * const count = await prisma.oTPChallenge.count({
     *   where: {
     *     // ... the filter for the OTPChallenges we want to count
     *   }
     * })
    **/
    count<T extends OTPChallengeCountArgs>(
      args?: Subset<T, OTPChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OTPChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OTPChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OTPChallengeAggregateArgs>(args: Subset<T, OTPChallengeAggregateArgs>): Prisma.PrismaPromise<GetOTPChallengeAggregateType<T>>

    /**
     * Group by OTPChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OTPChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OTPChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OTPChallengeGroupByArgs['orderBy'] }
        : { orderBy?: OTPChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OTPChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOTPChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OTPChallenge model
   */
  readonly fields: OTPChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OTPChallenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OTPChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends OTPChallenge$customerArgs<ExtArgs> = {}>(args?: Subset<T, OTPChallenge$customerArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OTPChallenge model
   */
  interface OTPChallengeFieldRefs {
    readonly id: FieldRef<"OTPChallenge", 'String'>
    readonly phoneE164: FieldRef<"OTPChallenge", 'String'>
    readonly provider: FieldRef<"OTPChallenge", 'String'>
    readonly providerSid: FieldRef<"OTPChallenge", 'String'>
    readonly status: FieldRef<"OTPChallenge", 'String'>
    readonly attemptsCount: FieldRef<"OTPChallenge", 'Int'>
    readonly requestedAt: FieldRef<"OTPChallenge", 'DateTime'>
    readonly verifiedAt: FieldRef<"OTPChallenge", 'DateTime'>
    readonly expiresAt: FieldRef<"OTPChallenge", 'DateTime'>
    readonly metadata: FieldRef<"OTPChallenge", 'Json'>
    readonly createdAt: FieldRef<"OTPChallenge", 'DateTime'>
    readonly customerProfileId: FieldRef<"OTPChallenge", 'String'>
  }
    

  // Custom InputTypes
  /**
   * OTPChallenge findUnique
   */
  export type OTPChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * Filter, which OTPChallenge to fetch.
     */
    where: OTPChallengeWhereUniqueInput
  }

  /**
   * OTPChallenge findUniqueOrThrow
   */
  export type OTPChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * Filter, which OTPChallenge to fetch.
     */
    where: OTPChallengeWhereUniqueInput
  }

  /**
   * OTPChallenge findFirst
   */
  export type OTPChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * Filter, which OTPChallenge to fetch.
     */
    where?: OTPChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPChallenges to fetch.
     */
    orderBy?: OTPChallengeOrderByWithRelationInput | OTPChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OTPChallenges.
     */
    cursor?: OTPChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPChallenges.
     */
    distinct?: OTPChallengeScalarFieldEnum | OTPChallengeScalarFieldEnum[]
  }

  /**
   * OTPChallenge findFirstOrThrow
   */
  export type OTPChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * Filter, which OTPChallenge to fetch.
     */
    where?: OTPChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPChallenges to fetch.
     */
    orderBy?: OTPChallengeOrderByWithRelationInput | OTPChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OTPChallenges.
     */
    cursor?: OTPChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPChallenges.
     */
    distinct?: OTPChallengeScalarFieldEnum | OTPChallengeScalarFieldEnum[]
  }

  /**
   * OTPChallenge findMany
   */
  export type OTPChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * Filter, which OTPChallenges to fetch.
     */
    where?: OTPChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OTPChallenges to fetch.
     */
    orderBy?: OTPChallengeOrderByWithRelationInput | OTPChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OTPChallenges.
     */
    cursor?: OTPChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OTPChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OTPChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OTPChallenges.
     */
    distinct?: OTPChallengeScalarFieldEnum | OTPChallengeScalarFieldEnum[]
  }

  /**
   * OTPChallenge create
   */
  export type OTPChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * The data needed to create a OTPChallenge.
     */
    data: XOR<OTPChallengeCreateInput, OTPChallengeUncheckedCreateInput>
  }

  /**
   * OTPChallenge createMany
   */
  export type OTPChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OTPChallenges.
     */
    data: OTPChallengeCreateManyInput | OTPChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OTPChallenge createManyAndReturn
   */
  export type OTPChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * The data used to create many OTPChallenges.
     */
    data: OTPChallengeCreateManyInput | OTPChallengeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OTPChallenge update
   */
  export type OTPChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * The data needed to update a OTPChallenge.
     */
    data: XOR<OTPChallengeUpdateInput, OTPChallengeUncheckedUpdateInput>
    /**
     * Choose, which OTPChallenge to update.
     */
    where: OTPChallengeWhereUniqueInput
  }

  /**
   * OTPChallenge updateMany
   */
  export type OTPChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OTPChallenges.
     */
    data: XOR<OTPChallengeUpdateManyMutationInput, OTPChallengeUncheckedUpdateManyInput>
    /**
     * Filter which OTPChallenges to update
     */
    where?: OTPChallengeWhereInput
    /**
     * Limit how many OTPChallenges to update.
     */
    limit?: number
  }

  /**
   * OTPChallenge updateManyAndReturn
   */
  export type OTPChallengeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * The data used to update OTPChallenges.
     */
    data: XOR<OTPChallengeUpdateManyMutationInput, OTPChallengeUncheckedUpdateManyInput>
    /**
     * Filter which OTPChallenges to update
     */
    where?: OTPChallengeWhereInput
    /**
     * Limit how many OTPChallenges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OTPChallenge upsert
   */
  export type OTPChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * The filter to search for the OTPChallenge to update in case it exists.
     */
    where: OTPChallengeWhereUniqueInput
    /**
     * In case the OTPChallenge found by the `where` argument doesn't exist, create a new OTPChallenge with this data.
     */
    create: XOR<OTPChallengeCreateInput, OTPChallengeUncheckedCreateInput>
    /**
     * In case the OTPChallenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OTPChallengeUpdateInput, OTPChallengeUncheckedUpdateInput>
  }

  /**
   * OTPChallenge delete
   */
  export type OTPChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
    /**
     * Filter which OTPChallenge to delete.
     */
    where: OTPChallengeWhereUniqueInput
  }

  /**
   * OTPChallenge deleteMany
   */
  export type OTPChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OTPChallenges to delete
     */
    where?: OTPChallengeWhereInput
    /**
     * Limit how many OTPChallenges to delete.
     */
    limit?: number
  }

  /**
   * OTPChallenge.customer
   */
  export type OTPChallenge$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerProfile
     */
    select?: CustomerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerProfile
     */
    omit?: CustomerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerProfileInclude<ExtArgs> | null
    where?: CustomerProfileWhereInput
  }

  /**
   * OTPChallenge without action
   */
  export type OTPChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTPChallenge
     */
    select?: OTPChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OTPChallenge
     */
    omit?: OTPChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OTPChallengeInclude<ExtArgs> | null
  }


  /**
   * Model AuditEvent
   */

  export type AggregateAuditEvent = {
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  export type AuditEventMinAggregateOutputType = {
    id: string | null
    actorType: string | null
    actorId: string | null
    eventType: string | null
    entityType: string | null
    entityId: string | null
    createdAt: Date | null
  }

  export type AuditEventMaxAggregateOutputType = {
    id: string | null
    actorType: string | null
    actorId: string | null
    eventType: string | null
    entityType: string | null
    entityId: string | null
    createdAt: Date | null
  }

  export type AuditEventCountAggregateOutputType = {
    id: number
    actorType: number
    actorId: number
    eventType: number
    entityType: number
    entityId: number
    payload: number
    createdAt: number
    _all: number
  }


  export type AuditEventMinAggregateInputType = {
    id?: true
    actorType?: true
    actorId?: true
    eventType?: true
    entityType?: true
    entityId?: true
    createdAt?: true
  }

  export type AuditEventMaxAggregateInputType = {
    id?: true
    actorType?: true
    actorId?: true
    eventType?: true
    entityType?: true
    entityId?: true
    createdAt?: true
  }

  export type AuditEventCountAggregateInputType = {
    id?: true
    actorType?: true
    actorId?: true
    eventType?: true
    entityType?: true
    entityId?: true
    payload?: true
    createdAt?: true
    _all?: true
  }

  export type AuditEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvent to aggregate.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditEvents
    **/
    _count?: true | AuditEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditEventMaxAggregateInputType
  }

  export type GetAuditEventAggregateType<T extends AuditEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditEvent[P]>
      : GetScalarType<T[P], AggregateAuditEvent[P]>
  }




  export type AuditEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithAggregationInput | AuditEventOrderByWithAggregationInput[]
    by: AuditEventScalarFieldEnum[] | AuditEventScalarFieldEnum
    having?: AuditEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditEventCountAggregateInputType | true
    _min?: AuditEventMinAggregateInputType
    _max?: AuditEventMaxAggregateInputType
  }

  export type AuditEventGroupByOutputType = {
    id: string
    actorType: string
    actorId: string | null
    eventType: string
    entityType: string
    entityId: string | null
    payload: JsonValue | null
    createdAt: Date
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  type GetAuditEventGroupByPayload<T extends AuditEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
            : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
        }
      >
    >


  export type AuditEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorType?: boolean
    actorId?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorType?: boolean
    actorId?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorType?: boolean
    actorId?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectScalar = {
    id?: boolean
    actorType?: boolean
    actorId?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    createdAt?: boolean
  }

  export type AuditEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "actorType" | "actorId" | "eventType" | "entityType" | "entityId" | "payload" | "createdAt", ExtArgs["result"]["auditEvent"]>

  export type $AuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      actorType: string
      actorId: string | null
      eventType: string
      entityType: string
      entityId: string | null
      payload: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditEvent"]>
    composites: {}
  }

  type AuditEventGetPayload<S extends boolean | null | undefined | AuditEventDefaultArgs> = $Result.GetResult<Prisma.$AuditEventPayload, S>

  type AuditEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditEventCountAggregateInputType | true
    }

  export interface AuditEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditEvent'], meta: { name: 'AuditEvent' } }
    /**
     * Find zero or one AuditEvent that matches the filter.
     * @param {AuditEventFindUniqueArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditEventFindUniqueArgs>(args: SelectSubset<T, AuditEventFindUniqueArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditEventFindUniqueOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditEventFindFirstArgs>(args?: SelectSubset<T, AuditEventFindFirstArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany()
     * 
     * // Get first 10 AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditEventFindManyArgs>(args?: SelectSubset<T, AuditEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditEvent.
     * @param {AuditEventCreateArgs} args - Arguments to create a AuditEvent.
     * @example
     * // Create one AuditEvent
     * const AuditEvent = await prisma.auditEvent.create({
     *   data: {
     *     // ... data to create a AuditEvent
     *   }
     * })
     * 
     */
    create<T extends AuditEventCreateArgs>(args: SelectSubset<T, AuditEventCreateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditEvents.
     * @param {AuditEventCreateManyArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditEventCreateManyArgs>(args?: SelectSubset<T, AuditEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditEvents and returns the data saved in the database.
     * @param {AuditEventCreateManyAndReturnArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditEvent.
     * @param {AuditEventDeleteArgs} args - Arguments to delete one AuditEvent.
     * @example
     * // Delete one AuditEvent
     * const AuditEvent = await prisma.auditEvent.delete({
     *   where: {
     *     // ... filter to delete one AuditEvent
     *   }
     * })
     * 
     */
    delete<T extends AuditEventDeleteArgs>(args: SelectSubset<T, AuditEventDeleteArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditEvent.
     * @param {AuditEventUpdateArgs} args - Arguments to update one AuditEvent.
     * @example
     * // Update one AuditEvent
     * const auditEvent = await prisma.auditEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditEventUpdateArgs>(args: SelectSubset<T, AuditEventUpdateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditEvents.
     * @param {AuditEventDeleteManyArgs} args - Arguments to filter AuditEvents to delete.
     * @example
     * // Delete a few AuditEvents
     * const { count } = await prisma.auditEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditEventDeleteManyArgs>(args?: SelectSubset<T, AuditEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditEventUpdateManyArgs>(args: SelectSubset<T, AuditEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents and returns the data updated in the database.
     * @param {AuditEventUpdateManyAndReturnArgs} args - Arguments to update many AuditEvents.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditEvent.
     * @param {AuditEventUpsertArgs} args - Arguments to update or create a AuditEvent.
     * @example
     * // Update or create a AuditEvent
     * const auditEvent = await prisma.auditEvent.upsert({
     *   create: {
     *     // ... data to create a AuditEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditEvent we want to update
     *   }
     * })
     */
    upsert<T extends AuditEventUpsertArgs>(args: SelectSubset<T, AuditEventUpsertArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventCountArgs} args - Arguments to filter AuditEvents to count.
     * @example
     * // Count the number of AuditEvents
     * const count = await prisma.auditEvent.count({
     *   where: {
     *     // ... the filter for the AuditEvents we want to count
     *   }
     * })
    **/
    count<T extends AuditEventCountArgs>(
      args?: Subset<T, AuditEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditEventAggregateArgs>(args: Subset<T, AuditEventAggregateArgs>): Prisma.PrismaPromise<GetAuditEventAggregateType<T>>

    /**
     * Group by AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditEventGroupByArgs['orderBy'] }
        : { orderBy?: AuditEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditEvent model
   */
  readonly fields: AuditEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditEvent model
   */
  interface AuditEventFieldRefs {
    readonly id: FieldRef<"AuditEvent", 'String'>
    readonly actorType: FieldRef<"AuditEvent", 'String'>
    readonly actorId: FieldRef<"AuditEvent", 'String'>
    readonly eventType: FieldRef<"AuditEvent", 'String'>
    readonly entityType: FieldRef<"AuditEvent", 'String'>
    readonly entityId: FieldRef<"AuditEvent", 'String'>
    readonly payload: FieldRef<"AuditEvent", 'Json'>
    readonly createdAt: FieldRef<"AuditEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditEvent findUnique
   */
  export type AuditEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findUniqueOrThrow
   */
  export type AuditEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findFirst
   */
  export type AuditEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findFirstOrThrow
   */
  export type AuditEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findMany
   */
  export type AuditEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvents to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent create
   */
  export type AuditEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditEvent.
     */
    data: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
  }

  /**
   * AuditEvent createMany
   */
  export type AuditEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent createManyAndReturn
   */
  export type AuditEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent update
   */
  export type AuditEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditEvent.
     */
    data: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
    /**
     * Choose, which AuditEvent to update.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent updateMany
   */
  export type AuditEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to update.
     */
    limit?: number
  }

  /**
   * AuditEvent updateManyAndReturn
   */
  export type AuditEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to update.
     */
    limit?: number
  }

  /**
   * AuditEvent upsert
   */
  export type AuditEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditEvent to update in case it exists.
     */
    where: AuditEventWhereUniqueInput
    /**
     * In case the AuditEvent found by the `where` argument doesn't exist, create a new AuditEvent with this data.
     */
    create: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
    /**
     * In case the AuditEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
  }

  /**
   * AuditEvent delete
   */
  export type AuditEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter which AuditEvent to delete.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent deleteMany
   */
  export type AuditEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvents to delete
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to delete.
     */
    limit?: number
  }

  /**
   * AuditEvent without action
   */
  export type AuditEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
  }


  /**
   * Model OrderActionRequest
   */

  export type AggregateOrderActionRequest = {
    _count: OrderActionRequestCountAggregateOutputType | null
    _min: OrderActionRequestMinAggregateOutputType | null
    _max: OrderActionRequestMaxAggregateOutputType | null
  }

  export type OrderActionRequestMinAggregateOutputType = {
    id: string | null
    requestType: $Enums.RequestType | null
    customerProfileId: string | null
    shopifyCustomerId: string | null
    shopifyOrderId: string | null
    orderNumber: string | null
    status: $Enums.ExchangeRequestStatus | null
    reason: string | null
    customerNote: string | null
    adminNote: string | null
    requestedAt: Date | null
    updatedAt: Date | null
    customerNameSnapshot: string | null
    customerPhoneSnapshot: string | null
    customerEmailSnapshot: string | null
    orderAmountSnapshot: string | null
    deliveryDateSnapshot: Date | null
    eligibilityDecision: string | null
    eligibilityReason: string | null
  }

  export type OrderActionRequestMaxAggregateOutputType = {
    id: string | null
    requestType: $Enums.RequestType | null
    customerProfileId: string | null
    shopifyCustomerId: string | null
    shopifyOrderId: string | null
    orderNumber: string | null
    status: $Enums.ExchangeRequestStatus | null
    reason: string | null
    customerNote: string | null
    adminNote: string | null
    requestedAt: Date | null
    updatedAt: Date | null
    customerNameSnapshot: string | null
    customerPhoneSnapshot: string | null
    customerEmailSnapshot: string | null
    orderAmountSnapshot: string | null
    deliveryDateSnapshot: Date | null
    eligibilityDecision: string | null
    eligibilityReason: string | null
  }

  export type OrderActionRequestCountAggregateOutputType = {
    id: number
    requestType: number
    customerProfileId: number
    shopifyCustomerId: number
    shopifyOrderId: number
    orderNumber: number
    status: number
    reason: number
    customerNote: number
    adminNote: number
    requestedAt: number
    updatedAt: number
    customerNameSnapshot: number
    customerPhoneSnapshot: number
    customerEmailSnapshot: number
    orderAmountSnapshot: number
    deliveryDateSnapshot: number
    eligibilityDecision: number
    eligibilityReason: number
    _all: number
  }


  export type OrderActionRequestMinAggregateInputType = {
    id?: true
    requestType?: true
    customerProfileId?: true
    shopifyCustomerId?: true
    shopifyOrderId?: true
    orderNumber?: true
    status?: true
    reason?: true
    customerNote?: true
    adminNote?: true
    requestedAt?: true
    updatedAt?: true
    customerNameSnapshot?: true
    customerPhoneSnapshot?: true
    customerEmailSnapshot?: true
    orderAmountSnapshot?: true
    deliveryDateSnapshot?: true
    eligibilityDecision?: true
    eligibilityReason?: true
  }

  export type OrderActionRequestMaxAggregateInputType = {
    id?: true
    requestType?: true
    customerProfileId?: true
    shopifyCustomerId?: true
    shopifyOrderId?: true
    orderNumber?: true
    status?: true
    reason?: true
    customerNote?: true
    adminNote?: true
    requestedAt?: true
    updatedAt?: true
    customerNameSnapshot?: true
    customerPhoneSnapshot?: true
    customerEmailSnapshot?: true
    orderAmountSnapshot?: true
    deliveryDateSnapshot?: true
    eligibilityDecision?: true
    eligibilityReason?: true
  }

  export type OrderActionRequestCountAggregateInputType = {
    id?: true
    requestType?: true
    customerProfileId?: true
    shopifyCustomerId?: true
    shopifyOrderId?: true
    orderNumber?: true
    status?: true
    reason?: true
    customerNote?: true
    adminNote?: true
    requestedAt?: true
    updatedAt?: true
    customerNameSnapshot?: true
    customerPhoneSnapshot?: true
    customerEmailSnapshot?: true
    orderAmountSnapshot?: true
    deliveryDateSnapshot?: true
    eligibilityDecision?: true
    eligibilityReason?: true
    _all?: true
  }

  export type OrderActionRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderActionRequest to aggregate.
     */
    where?: OrderActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionRequests to fetch.
     */
    orderBy?: OrderActionRequestOrderByWithRelationInput | OrderActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderActionRequests
    **/
    _count?: true | OrderActionRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderActionRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderActionRequestMaxAggregateInputType
  }

  export type GetOrderActionRequestAggregateType<T extends OrderActionRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderActionRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderActionRequest[P]>
      : GetScalarType<T[P], AggregateOrderActionRequest[P]>
  }




  export type OrderActionRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderActionRequestWhereInput
    orderBy?: OrderActionRequestOrderByWithAggregationInput | OrderActionRequestOrderByWithAggregationInput[]
    by: OrderActionRequestScalarFieldEnum[] | OrderActionRequestScalarFieldEnum
    having?: OrderActionRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderActionRequestCountAggregateInputType | true
    _min?: OrderActionRequestMinAggregateInputType
    _max?: OrderActionRequestMaxAggregateInputType
  }

  export type OrderActionRequestGroupByOutputType = {
    id: string
    requestType: $Enums.RequestType
    customerProfileId: string
    shopifyCustomerId: string | null
    shopifyOrderId: string | null
    orderNumber: string
    status: $Enums.ExchangeRequestStatus
    reason: string | null
    customerNote: string | null
    adminNote: string | null
    requestedAt: Date
    updatedAt: Date
    customerNameSnapshot: string | null
    customerPhoneSnapshot: string | null
    customerEmailSnapshot: string | null
    orderAmountSnapshot: string | null
    deliveryDateSnapshot: Date | null
    eligibilityDecision: string | null
    eligibilityReason: string | null
    _count: OrderActionRequestCountAggregateOutputType | null
    _min: OrderActionRequestMinAggregateOutputType | null
    _max: OrderActionRequestMaxAggregateOutputType | null
  }

  type GetOrderActionRequestGroupByPayload<T extends OrderActionRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderActionRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderActionRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderActionRequestGroupByOutputType[P]>
            : GetScalarType<T[P], OrderActionRequestGroupByOutputType[P]>
        }
      >
    >


  export type OrderActionRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestType?: boolean
    customerProfileId?: boolean
    shopifyCustomerId?: boolean
    shopifyOrderId?: boolean
    orderNumber?: boolean
    status?: boolean
    reason?: boolean
    customerNote?: boolean
    adminNote?: boolean
    requestedAt?: boolean
    updatedAt?: boolean
    customerNameSnapshot?: boolean
    customerPhoneSnapshot?: boolean
    customerEmailSnapshot?: boolean
    orderAmountSnapshot?: boolean
    deliveryDateSnapshot?: boolean
    eligibilityDecision?: boolean
    eligibilityReason?: boolean
    customerProfile?: boolean | CustomerProfileDefaultArgs<ExtArgs>
    items?: boolean | OrderActionRequest$itemsArgs<ExtArgs>
    payments?: boolean | OrderActionRequest$paymentsArgs<ExtArgs>
    shipments?: boolean | OrderActionRequest$shipmentsArgs<ExtArgs>
    _count?: boolean | OrderActionRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderActionRequest"]>

  export type OrderActionRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestType?: boolean
    customerProfileId?: boolean
    shopifyCustomerId?: boolean
    shopifyOrderId?: boolean
    orderNumber?: boolean
    status?: boolean
    reason?: boolean
    customerNote?: boolean
    adminNote?: boolean
    requestedAt?: boolean
    updatedAt?: boolean
    customerNameSnapshot?: boolean
    customerPhoneSnapshot?: boolean
    customerEmailSnapshot?: boolean
    orderAmountSnapshot?: boolean
    deliveryDateSnapshot?: boolean
    eligibilityDecision?: boolean
    eligibilityReason?: boolean
    customerProfile?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderActionRequest"]>

  export type OrderActionRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestType?: boolean
    customerProfileId?: boolean
    shopifyCustomerId?: boolean
    shopifyOrderId?: boolean
    orderNumber?: boolean
    status?: boolean
    reason?: boolean
    customerNote?: boolean
    adminNote?: boolean
    requestedAt?: boolean
    updatedAt?: boolean
    customerNameSnapshot?: boolean
    customerPhoneSnapshot?: boolean
    customerEmailSnapshot?: boolean
    orderAmountSnapshot?: boolean
    deliveryDateSnapshot?: boolean
    eligibilityDecision?: boolean
    eligibilityReason?: boolean
    customerProfile?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderActionRequest"]>

  export type OrderActionRequestSelectScalar = {
    id?: boolean
    requestType?: boolean
    customerProfileId?: boolean
    shopifyCustomerId?: boolean
    shopifyOrderId?: boolean
    orderNumber?: boolean
    status?: boolean
    reason?: boolean
    customerNote?: boolean
    adminNote?: boolean
    requestedAt?: boolean
    updatedAt?: boolean
    customerNameSnapshot?: boolean
    customerPhoneSnapshot?: boolean
    customerEmailSnapshot?: boolean
    orderAmountSnapshot?: boolean
    deliveryDateSnapshot?: boolean
    eligibilityDecision?: boolean
    eligibilityReason?: boolean
  }

  export type OrderActionRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestType" | "customerProfileId" | "shopifyCustomerId" | "shopifyOrderId" | "orderNumber" | "status" | "reason" | "customerNote" | "adminNote" | "requestedAt" | "updatedAt" | "customerNameSnapshot" | "customerPhoneSnapshot" | "customerEmailSnapshot" | "orderAmountSnapshot" | "deliveryDateSnapshot" | "eligibilityDecision" | "eligibilityReason", ExtArgs["result"]["orderActionRequest"]>
  export type OrderActionRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customerProfile?: boolean | CustomerProfileDefaultArgs<ExtArgs>
    items?: boolean | OrderActionRequest$itemsArgs<ExtArgs>
    payments?: boolean | OrderActionRequest$paymentsArgs<ExtArgs>
    shipments?: boolean | OrderActionRequest$shipmentsArgs<ExtArgs>
    _count?: boolean | OrderActionRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrderActionRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customerProfile?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }
  export type OrderActionRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customerProfile?: boolean | CustomerProfileDefaultArgs<ExtArgs>
  }

  export type $OrderActionRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderActionRequest"
    objects: {
      customerProfile: Prisma.$CustomerProfilePayload<ExtArgs>
      items: Prisma.$OrderActionItemPayload<ExtArgs>[]
      payments: Prisma.$RequestPaymentPayload<ExtArgs>[]
      shipments: Prisma.$ShipmentTrackingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestType: $Enums.RequestType
      customerProfileId: string
      shopifyCustomerId: string | null
      shopifyOrderId: string | null
      orderNumber: string
      status: $Enums.ExchangeRequestStatus
      reason: string | null
      customerNote: string | null
      adminNote: string | null
      requestedAt: Date
      updatedAt: Date
      customerNameSnapshot: string | null
      customerPhoneSnapshot: string | null
      customerEmailSnapshot: string | null
      orderAmountSnapshot: string | null
      deliveryDateSnapshot: Date | null
      eligibilityDecision: string | null
      eligibilityReason: string | null
    }, ExtArgs["result"]["orderActionRequest"]>
    composites: {}
  }

  type OrderActionRequestGetPayload<S extends boolean | null | undefined | OrderActionRequestDefaultArgs> = $Result.GetResult<Prisma.$OrderActionRequestPayload, S>

  type OrderActionRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderActionRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderActionRequestCountAggregateInputType | true
    }

  export interface OrderActionRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderActionRequest'], meta: { name: 'OrderActionRequest' } }
    /**
     * Find zero or one OrderActionRequest that matches the filter.
     * @param {OrderActionRequestFindUniqueArgs} args - Arguments to find a OrderActionRequest
     * @example
     * // Get one OrderActionRequest
     * const orderActionRequest = await prisma.orderActionRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderActionRequestFindUniqueArgs>(args: SelectSubset<T, OrderActionRequestFindUniqueArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderActionRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderActionRequestFindUniqueOrThrowArgs} args - Arguments to find a OrderActionRequest
     * @example
     * // Get one OrderActionRequest
     * const orderActionRequest = await prisma.orderActionRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderActionRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderActionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderActionRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestFindFirstArgs} args - Arguments to find a OrderActionRequest
     * @example
     * // Get one OrderActionRequest
     * const orderActionRequest = await prisma.orderActionRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderActionRequestFindFirstArgs>(args?: SelectSubset<T, OrderActionRequestFindFirstArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderActionRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestFindFirstOrThrowArgs} args - Arguments to find a OrderActionRequest
     * @example
     * // Get one OrderActionRequest
     * const orderActionRequest = await prisma.orderActionRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderActionRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderActionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderActionRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderActionRequests
     * const orderActionRequests = await prisma.orderActionRequest.findMany()
     * 
     * // Get first 10 OrderActionRequests
     * const orderActionRequests = await prisma.orderActionRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderActionRequestWithIdOnly = await prisma.orderActionRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderActionRequestFindManyArgs>(args?: SelectSubset<T, OrderActionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderActionRequest.
     * @param {OrderActionRequestCreateArgs} args - Arguments to create a OrderActionRequest.
     * @example
     * // Create one OrderActionRequest
     * const OrderActionRequest = await prisma.orderActionRequest.create({
     *   data: {
     *     // ... data to create a OrderActionRequest
     *   }
     * })
     * 
     */
    create<T extends OrderActionRequestCreateArgs>(args: SelectSubset<T, OrderActionRequestCreateArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderActionRequests.
     * @param {OrderActionRequestCreateManyArgs} args - Arguments to create many OrderActionRequests.
     * @example
     * // Create many OrderActionRequests
     * const orderActionRequest = await prisma.orderActionRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderActionRequestCreateManyArgs>(args?: SelectSubset<T, OrderActionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderActionRequests and returns the data saved in the database.
     * @param {OrderActionRequestCreateManyAndReturnArgs} args - Arguments to create many OrderActionRequests.
     * @example
     * // Create many OrderActionRequests
     * const orderActionRequest = await prisma.orderActionRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderActionRequests and only return the `id`
     * const orderActionRequestWithIdOnly = await prisma.orderActionRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderActionRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderActionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderActionRequest.
     * @param {OrderActionRequestDeleteArgs} args - Arguments to delete one OrderActionRequest.
     * @example
     * // Delete one OrderActionRequest
     * const OrderActionRequest = await prisma.orderActionRequest.delete({
     *   where: {
     *     // ... filter to delete one OrderActionRequest
     *   }
     * })
     * 
     */
    delete<T extends OrderActionRequestDeleteArgs>(args: SelectSubset<T, OrderActionRequestDeleteArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderActionRequest.
     * @param {OrderActionRequestUpdateArgs} args - Arguments to update one OrderActionRequest.
     * @example
     * // Update one OrderActionRequest
     * const orderActionRequest = await prisma.orderActionRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderActionRequestUpdateArgs>(args: SelectSubset<T, OrderActionRequestUpdateArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderActionRequests.
     * @param {OrderActionRequestDeleteManyArgs} args - Arguments to filter OrderActionRequests to delete.
     * @example
     * // Delete a few OrderActionRequests
     * const { count } = await prisma.orderActionRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderActionRequestDeleteManyArgs>(args?: SelectSubset<T, OrderActionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderActionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderActionRequests
     * const orderActionRequest = await prisma.orderActionRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderActionRequestUpdateManyArgs>(args: SelectSubset<T, OrderActionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderActionRequests and returns the data updated in the database.
     * @param {OrderActionRequestUpdateManyAndReturnArgs} args - Arguments to update many OrderActionRequests.
     * @example
     * // Update many OrderActionRequests
     * const orderActionRequest = await prisma.orderActionRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderActionRequests and only return the `id`
     * const orderActionRequestWithIdOnly = await prisma.orderActionRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderActionRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderActionRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderActionRequest.
     * @param {OrderActionRequestUpsertArgs} args - Arguments to update or create a OrderActionRequest.
     * @example
     * // Update or create a OrderActionRequest
     * const orderActionRequest = await prisma.orderActionRequest.upsert({
     *   create: {
     *     // ... data to create a OrderActionRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderActionRequest we want to update
     *   }
     * })
     */
    upsert<T extends OrderActionRequestUpsertArgs>(args: SelectSubset<T, OrderActionRequestUpsertArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderActionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestCountArgs} args - Arguments to filter OrderActionRequests to count.
     * @example
     * // Count the number of OrderActionRequests
     * const count = await prisma.orderActionRequest.count({
     *   where: {
     *     // ... the filter for the OrderActionRequests we want to count
     *   }
     * })
    **/
    count<T extends OrderActionRequestCountArgs>(
      args?: Subset<T, OrderActionRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderActionRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderActionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderActionRequestAggregateArgs>(args: Subset<T, OrderActionRequestAggregateArgs>): Prisma.PrismaPromise<GetOrderActionRequestAggregateType<T>>

    /**
     * Group by OrderActionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderActionRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderActionRequestGroupByArgs['orderBy'] }
        : { orderBy?: OrderActionRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderActionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderActionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderActionRequest model
   */
  readonly fields: OrderActionRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderActionRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderActionRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customerProfile<T extends CustomerProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerProfileDefaultArgs<ExtArgs>>): Prisma__CustomerProfileClient<$Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends OrderActionRequest$itemsArgs<ExtArgs> = {}>(args?: Subset<T, OrderActionRequest$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends OrderActionRequest$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, OrderActionRequest$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    shipments<T extends OrderActionRequest$shipmentsArgs<ExtArgs> = {}>(args?: Subset<T, OrderActionRequest$shipmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderActionRequest model
   */
  interface OrderActionRequestFieldRefs {
    readonly id: FieldRef<"OrderActionRequest", 'String'>
    readonly requestType: FieldRef<"OrderActionRequest", 'RequestType'>
    readonly customerProfileId: FieldRef<"OrderActionRequest", 'String'>
    readonly shopifyCustomerId: FieldRef<"OrderActionRequest", 'String'>
    readonly shopifyOrderId: FieldRef<"OrderActionRequest", 'String'>
    readonly orderNumber: FieldRef<"OrderActionRequest", 'String'>
    readonly status: FieldRef<"OrderActionRequest", 'ExchangeRequestStatus'>
    readonly reason: FieldRef<"OrderActionRequest", 'String'>
    readonly customerNote: FieldRef<"OrderActionRequest", 'String'>
    readonly adminNote: FieldRef<"OrderActionRequest", 'String'>
    readonly requestedAt: FieldRef<"OrderActionRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"OrderActionRequest", 'DateTime'>
    readonly customerNameSnapshot: FieldRef<"OrderActionRequest", 'String'>
    readonly customerPhoneSnapshot: FieldRef<"OrderActionRequest", 'String'>
    readonly customerEmailSnapshot: FieldRef<"OrderActionRequest", 'String'>
    readonly orderAmountSnapshot: FieldRef<"OrderActionRequest", 'String'>
    readonly deliveryDateSnapshot: FieldRef<"OrderActionRequest", 'DateTime'>
    readonly eligibilityDecision: FieldRef<"OrderActionRequest", 'String'>
    readonly eligibilityReason: FieldRef<"OrderActionRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * OrderActionRequest findUnique
   */
  export type OrderActionRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionRequest to fetch.
     */
    where: OrderActionRequestWhereUniqueInput
  }

  /**
   * OrderActionRequest findUniqueOrThrow
   */
  export type OrderActionRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionRequest to fetch.
     */
    where: OrderActionRequestWhereUniqueInput
  }

  /**
   * OrderActionRequest findFirst
   */
  export type OrderActionRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionRequest to fetch.
     */
    where?: OrderActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionRequests to fetch.
     */
    orderBy?: OrderActionRequestOrderByWithRelationInput | OrderActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderActionRequests.
     */
    cursor?: OrderActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderActionRequests.
     */
    distinct?: OrderActionRequestScalarFieldEnum | OrderActionRequestScalarFieldEnum[]
  }

  /**
   * OrderActionRequest findFirstOrThrow
   */
  export type OrderActionRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionRequest to fetch.
     */
    where?: OrderActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionRequests to fetch.
     */
    orderBy?: OrderActionRequestOrderByWithRelationInput | OrderActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderActionRequests.
     */
    cursor?: OrderActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderActionRequests.
     */
    distinct?: OrderActionRequestScalarFieldEnum | OrderActionRequestScalarFieldEnum[]
  }

  /**
   * OrderActionRequest findMany
   */
  export type OrderActionRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionRequests to fetch.
     */
    where?: OrderActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionRequests to fetch.
     */
    orderBy?: OrderActionRequestOrderByWithRelationInput | OrderActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderActionRequests.
     */
    cursor?: OrderActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderActionRequests.
     */
    distinct?: OrderActionRequestScalarFieldEnum | OrderActionRequestScalarFieldEnum[]
  }

  /**
   * OrderActionRequest create
   */
  export type OrderActionRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderActionRequest.
     */
    data: XOR<OrderActionRequestCreateInput, OrderActionRequestUncheckedCreateInput>
  }

  /**
   * OrderActionRequest createMany
   */
  export type OrderActionRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderActionRequests.
     */
    data: OrderActionRequestCreateManyInput | OrderActionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderActionRequest createManyAndReturn
   */
  export type OrderActionRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * The data used to create many OrderActionRequests.
     */
    data: OrderActionRequestCreateManyInput | OrderActionRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderActionRequest update
   */
  export type OrderActionRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderActionRequest.
     */
    data: XOR<OrderActionRequestUpdateInput, OrderActionRequestUncheckedUpdateInput>
    /**
     * Choose, which OrderActionRequest to update.
     */
    where: OrderActionRequestWhereUniqueInput
  }

  /**
   * OrderActionRequest updateMany
   */
  export type OrderActionRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderActionRequests.
     */
    data: XOR<OrderActionRequestUpdateManyMutationInput, OrderActionRequestUncheckedUpdateManyInput>
    /**
     * Filter which OrderActionRequests to update
     */
    where?: OrderActionRequestWhereInput
    /**
     * Limit how many OrderActionRequests to update.
     */
    limit?: number
  }

  /**
   * OrderActionRequest updateManyAndReturn
   */
  export type OrderActionRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * The data used to update OrderActionRequests.
     */
    data: XOR<OrderActionRequestUpdateManyMutationInput, OrderActionRequestUncheckedUpdateManyInput>
    /**
     * Filter which OrderActionRequests to update
     */
    where?: OrderActionRequestWhereInput
    /**
     * Limit how many OrderActionRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderActionRequest upsert
   */
  export type OrderActionRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderActionRequest to update in case it exists.
     */
    where: OrderActionRequestWhereUniqueInput
    /**
     * In case the OrderActionRequest found by the `where` argument doesn't exist, create a new OrderActionRequest with this data.
     */
    create: XOR<OrderActionRequestCreateInput, OrderActionRequestUncheckedCreateInput>
    /**
     * In case the OrderActionRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderActionRequestUpdateInput, OrderActionRequestUncheckedUpdateInput>
  }

  /**
   * OrderActionRequest delete
   */
  export type OrderActionRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
    /**
     * Filter which OrderActionRequest to delete.
     */
    where: OrderActionRequestWhereUniqueInput
  }

  /**
   * OrderActionRequest deleteMany
   */
  export type OrderActionRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderActionRequests to delete
     */
    where?: OrderActionRequestWhereInput
    /**
     * Limit how many OrderActionRequests to delete.
     */
    limit?: number
  }

  /**
   * OrderActionRequest.items
   */
  export type OrderActionRequest$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    where?: OrderActionItemWhereInput
    orderBy?: OrderActionItemOrderByWithRelationInput | OrderActionItemOrderByWithRelationInput[]
    cursor?: OrderActionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderActionItemScalarFieldEnum | OrderActionItemScalarFieldEnum[]
  }

  /**
   * OrderActionRequest.payments
   */
  export type OrderActionRequest$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    where?: RequestPaymentWhereInput
    orderBy?: RequestPaymentOrderByWithRelationInput | RequestPaymentOrderByWithRelationInput[]
    cursor?: RequestPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestPaymentScalarFieldEnum | RequestPaymentScalarFieldEnum[]
  }

  /**
   * OrderActionRequest.shipments
   */
  export type OrderActionRequest$shipmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    where?: ShipmentTrackingWhereInput
    orderBy?: ShipmentTrackingOrderByWithRelationInput | ShipmentTrackingOrderByWithRelationInput[]
    cursor?: ShipmentTrackingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentTrackingScalarFieldEnum | ShipmentTrackingScalarFieldEnum[]
  }

  /**
   * OrderActionRequest without action
   */
  export type OrderActionRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionRequest
     */
    select?: OrderActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionRequest
     */
    omit?: OrderActionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionRequestInclude<ExtArgs> | null
  }


  /**
   * Model OrderActionItem
   */

  export type AggregateOrderActionItem = {
    _count: OrderActionItemCountAggregateOutputType | null
    _avg: OrderActionItemAvgAggregateOutputType | null
    _sum: OrderActionItemSumAggregateOutputType | null
    _min: OrderActionItemMinAggregateOutputType | null
    _max: OrderActionItemMaxAggregateOutputType | null
  }

  export type OrderActionItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type OrderActionItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type OrderActionItemMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    shopifyLineItemId: string | null
    productTitle: string | null
    variantTitle: string | null
    sku: string | null
    currentSize: string | null
    requestedSize: string | null
    quantity: number | null
    isClearance: boolean | null
    isExcludedCategory: boolean | null
    createdAt: Date | null
  }

  export type OrderActionItemMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    shopifyLineItemId: string | null
    productTitle: string | null
    variantTitle: string | null
    sku: string | null
    currentSize: string | null
    requestedSize: string | null
    quantity: number | null
    isClearance: boolean | null
    isExcludedCategory: boolean | null
    createdAt: Date | null
  }

  export type OrderActionItemCountAggregateOutputType = {
    id: number
    requestId: number
    shopifyLineItemId: number
    productTitle: number
    variantTitle: number
    sku: number
    currentSize: number
    requestedSize: number
    quantity: number
    isClearance: number
    isExcludedCategory: number
    eligibilitySnapshot: number
    createdAt: number
    _all: number
  }


  export type OrderActionItemAvgAggregateInputType = {
    quantity?: true
  }

  export type OrderActionItemSumAggregateInputType = {
    quantity?: true
  }

  export type OrderActionItemMinAggregateInputType = {
    id?: true
    requestId?: true
    shopifyLineItemId?: true
    productTitle?: true
    variantTitle?: true
    sku?: true
    currentSize?: true
    requestedSize?: true
    quantity?: true
    isClearance?: true
    isExcludedCategory?: true
    createdAt?: true
  }

  export type OrderActionItemMaxAggregateInputType = {
    id?: true
    requestId?: true
    shopifyLineItemId?: true
    productTitle?: true
    variantTitle?: true
    sku?: true
    currentSize?: true
    requestedSize?: true
    quantity?: true
    isClearance?: true
    isExcludedCategory?: true
    createdAt?: true
  }

  export type OrderActionItemCountAggregateInputType = {
    id?: true
    requestId?: true
    shopifyLineItemId?: true
    productTitle?: true
    variantTitle?: true
    sku?: true
    currentSize?: true
    requestedSize?: true
    quantity?: true
    isClearance?: true
    isExcludedCategory?: true
    eligibilitySnapshot?: true
    createdAt?: true
    _all?: true
  }

  export type OrderActionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderActionItem to aggregate.
     */
    where?: OrderActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionItems to fetch.
     */
    orderBy?: OrderActionItemOrderByWithRelationInput | OrderActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderActionItems
    **/
    _count?: true | OrderActionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderActionItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderActionItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderActionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderActionItemMaxAggregateInputType
  }

  export type GetOrderActionItemAggregateType<T extends OrderActionItemAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderActionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderActionItem[P]>
      : GetScalarType<T[P], AggregateOrderActionItem[P]>
  }




  export type OrderActionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderActionItemWhereInput
    orderBy?: OrderActionItemOrderByWithAggregationInput | OrderActionItemOrderByWithAggregationInput[]
    by: OrderActionItemScalarFieldEnum[] | OrderActionItemScalarFieldEnum
    having?: OrderActionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderActionItemCountAggregateInputType | true
    _avg?: OrderActionItemAvgAggregateInputType
    _sum?: OrderActionItemSumAggregateInputType
    _min?: OrderActionItemMinAggregateInputType
    _max?: OrderActionItemMaxAggregateInputType
  }

  export type OrderActionItemGroupByOutputType = {
    id: string
    requestId: string
    shopifyLineItemId: string | null
    productTitle: string
    variantTitle: string | null
    sku: string | null
    currentSize: string | null
    requestedSize: string
    quantity: number
    isClearance: boolean
    isExcludedCategory: boolean
    eligibilitySnapshot: JsonValue | null
    createdAt: Date
    _count: OrderActionItemCountAggregateOutputType | null
    _avg: OrderActionItemAvgAggregateOutputType | null
    _sum: OrderActionItemSumAggregateOutputType | null
    _min: OrderActionItemMinAggregateOutputType | null
    _max: OrderActionItemMaxAggregateOutputType | null
  }

  type GetOrderActionItemGroupByPayload<T extends OrderActionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderActionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderActionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderActionItemGroupByOutputType[P]>
            : GetScalarType<T[P], OrderActionItemGroupByOutputType[P]>
        }
      >
    >


  export type OrderActionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    shopifyLineItemId?: boolean
    productTitle?: boolean
    variantTitle?: boolean
    sku?: boolean
    currentSize?: boolean
    requestedSize?: boolean
    quantity?: boolean
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: boolean
    createdAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderActionItem"]>

  export type OrderActionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    shopifyLineItemId?: boolean
    productTitle?: boolean
    variantTitle?: boolean
    sku?: boolean
    currentSize?: boolean
    requestedSize?: boolean
    quantity?: boolean
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: boolean
    createdAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderActionItem"]>

  export type OrderActionItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    shopifyLineItemId?: boolean
    productTitle?: boolean
    variantTitle?: boolean
    sku?: boolean
    currentSize?: boolean
    requestedSize?: boolean
    quantity?: boolean
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: boolean
    createdAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderActionItem"]>

  export type OrderActionItemSelectScalar = {
    id?: boolean
    requestId?: boolean
    shopifyLineItemId?: boolean
    productTitle?: boolean
    variantTitle?: boolean
    sku?: boolean
    currentSize?: boolean
    requestedSize?: boolean
    quantity?: boolean
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: boolean
    createdAt?: boolean
  }

  export type OrderActionItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestId" | "shopifyLineItemId" | "productTitle" | "variantTitle" | "sku" | "currentSize" | "requestedSize" | "quantity" | "isClearance" | "isExcludedCategory" | "eligibilitySnapshot" | "createdAt", ExtArgs["result"]["orderActionItem"]>
  export type OrderActionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }
  export type OrderActionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }
  export type OrderActionItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }

  export type $OrderActionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderActionItem"
    objects: {
      request: Prisma.$OrderActionRequestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      shopifyLineItemId: string | null
      productTitle: string
      variantTitle: string | null
      sku: string | null
      currentSize: string | null
      requestedSize: string
      quantity: number
      isClearance: boolean
      isExcludedCategory: boolean
      eligibilitySnapshot: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["orderActionItem"]>
    composites: {}
  }

  type OrderActionItemGetPayload<S extends boolean | null | undefined | OrderActionItemDefaultArgs> = $Result.GetResult<Prisma.$OrderActionItemPayload, S>

  type OrderActionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderActionItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderActionItemCountAggregateInputType | true
    }

  export interface OrderActionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderActionItem'], meta: { name: 'OrderActionItem' } }
    /**
     * Find zero or one OrderActionItem that matches the filter.
     * @param {OrderActionItemFindUniqueArgs} args - Arguments to find a OrderActionItem
     * @example
     * // Get one OrderActionItem
     * const orderActionItem = await prisma.orderActionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderActionItemFindUniqueArgs>(args: SelectSubset<T, OrderActionItemFindUniqueArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderActionItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderActionItemFindUniqueOrThrowArgs} args - Arguments to find a OrderActionItem
     * @example
     * // Get one OrderActionItem
     * const orderActionItem = await prisma.orderActionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderActionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderActionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderActionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemFindFirstArgs} args - Arguments to find a OrderActionItem
     * @example
     * // Get one OrderActionItem
     * const orderActionItem = await prisma.orderActionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderActionItemFindFirstArgs>(args?: SelectSubset<T, OrderActionItemFindFirstArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderActionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemFindFirstOrThrowArgs} args - Arguments to find a OrderActionItem
     * @example
     * // Get one OrderActionItem
     * const orderActionItem = await prisma.orderActionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderActionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderActionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderActionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderActionItems
     * const orderActionItems = await prisma.orderActionItem.findMany()
     * 
     * // Get first 10 OrderActionItems
     * const orderActionItems = await prisma.orderActionItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderActionItemWithIdOnly = await prisma.orderActionItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderActionItemFindManyArgs>(args?: SelectSubset<T, OrderActionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderActionItem.
     * @param {OrderActionItemCreateArgs} args - Arguments to create a OrderActionItem.
     * @example
     * // Create one OrderActionItem
     * const OrderActionItem = await prisma.orderActionItem.create({
     *   data: {
     *     // ... data to create a OrderActionItem
     *   }
     * })
     * 
     */
    create<T extends OrderActionItemCreateArgs>(args: SelectSubset<T, OrderActionItemCreateArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderActionItems.
     * @param {OrderActionItemCreateManyArgs} args - Arguments to create many OrderActionItems.
     * @example
     * // Create many OrderActionItems
     * const orderActionItem = await prisma.orderActionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderActionItemCreateManyArgs>(args?: SelectSubset<T, OrderActionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderActionItems and returns the data saved in the database.
     * @param {OrderActionItemCreateManyAndReturnArgs} args - Arguments to create many OrderActionItems.
     * @example
     * // Create many OrderActionItems
     * const orderActionItem = await prisma.orderActionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderActionItems and only return the `id`
     * const orderActionItemWithIdOnly = await prisma.orderActionItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderActionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderActionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderActionItem.
     * @param {OrderActionItemDeleteArgs} args - Arguments to delete one OrderActionItem.
     * @example
     * // Delete one OrderActionItem
     * const OrderActionItem = await prisma.orderActionItem.delete({
     *   where: {
     *     // ... filter to delete one OrderActionItem
     *   }
     * })
     * 
     */
    delete<T extends OrderActionItemDeleteArgs>(args: SelectSubset<T, OrderActionItemDeleteArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderActionItem.
     * @param {OrderActionItemUpdateArgs} args - Arguments to update one OrderActionItem.
     * @example
     * // Update one OrderActionItem
     * const orderActionItem = await prisma.orderActionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderActionItemUpdateArgs>(args: SelectSubset<T, OrderActionItemUpdateArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderActionItems.
     * @param {OrderActionItemDeleteManyArgs} args - Arguments to filter OrderActionItems to delete.
     * @example
     * // Delete a few OrderActionItems
     * const { count } = await prisma.orderActionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderActionItemDeleteManyArgs>(args?: SelectSubset<T, OrderActionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderActionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderActionItems
     * const orderActionItem = await prisma.orderActionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderActionItemUpdateManyArgs>(args: SelectSubset<T, OrderActionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderActionItems and returns the data updated in the database.
     * @param {OrderActionItemUpdateManyAndReturnArgs} args - Arguments to update many OrderActionItems.
     * @example
     * // Update many OrderActionItems
     * const orderActionItem = await prisma.orderActionItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderActionItems and only return the `id`
     * const orderActionItemWithIdOnly = await prisma.orderActionItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderActionItemUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderActionItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderActionItem.
     * @param {OrderActionItemUpsertArgs} args - Arguments to update or create a OrderActionItem.
     * @example
     * // Update or create a OrderActionItem
     * const orderActionItem = await prisma.orderActionItem.upsert({
     *   create: {
     *     // ... data to create a OrderActionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderActionItem we want to update
     *   }
     * })
     */
    upsert<T extends OrderActionItemUpsertArgs>(args: SelectSubset<T, OrderActionItemUpsertArgs<ExtArgs>>): Prisma__OrderActionItemClient<$Result.GetResult<Prisma.$OrderActionItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderActionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemCountArgs} args - Arguments to filter OrderActionItems to count.
     * @example
     * // Count the number of OrderActionItems
     * const count = await prisma.orderActionItem.count({
     *   where: {
     *     // ... the filter for the OrderActionItems we want to count
     *   }
     * })
    **/
    count<T extends OrderActionItemCountArgs>(
      args?: Subset<T, OrderActionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderActionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderActionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderActionItemAggregateArgs>(args: Subset<T, OrderActionItemAggregateArgs>): Prisma.PrismaPromise<GetOrderActionItemAggregateType<T>>

    /**
     * Group by OrderActionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderActionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderActionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderActionItemGroupByArgs['orderBy'] }
        : { orderBy?: OrderActionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderActionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderActionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderActionItem model
   */
  readonly fields: OrderActionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderActionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderActionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends OrderActionRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderActionRequestDefaultArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderActionItem model
   */
  interface OrderActionItemFieldRefs {
    readonly id: FieldRef<"OrderActionItem", 'String'>
    readonly requestId: FieldRef<"OrderActionItem", 'String'>
    readonly shopifyLineItemId: FieldRef<"OrderActionItem", 'String'>
    readonly productTitle: FieldRef<"OrderActionItem", 'String'>
    readonly variantTitle: FieldRef<"OrderActionItem", 'String'>
    readonly sku: FieldRef<"OrderActionItem", 'String'>
    readonly currentSize: FieldRef<"OrderActionItem", 'String'>
    readonly requestedSize: FieldRef<"OrderActionItem", 'String'>
    readonly quantity: FieldRef<"OrderActionItem", 'Int'>
    readonly isClearance: FieldRef<"OrderActionItem", 'Boolean'>
    readonly isExcludedCategory: FieldRef<"OrderActionItem", 'Boolean'>
    readonly eligibilitySnapshot: FieldRef<"OrderActionItem", 'Json'>
    readonly createdAt: FieldRef<"OrderActionItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrderActionItem findUnique
   */
  export type OrderActionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionItem to fetch.
     */
    where: OrderActionItemWhereUniqueInput
  }

  /**
   * OrderActionItem findUniqueOrThrow
   */
  export type OrderActionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionItem to fetch.
     */
    where: OrderActionItemWhereUniqueInput
  }

  /**
   * OrderActionItem findFirst
   */
  export type OrderActionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionItem to fetch.
     */
    where?: OrderActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionItems to fetch.
     */
    orderBy?: OrderActionItemOrderByWithRelationInput | OrderActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderActionItems.
     */
    cursor?: OrderActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderActionItems.
     */
    distinct?: OrderActionItemScalarFieldEnum | OrderActionItemScalarFieldEnum[]
  }

  /**
   * OrderActionItem findFirstOrThrow
   */
  export type OrderActionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionItem to fetch.
     */
    where?: OrderActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionItems to fetch.
     */
    orderBy?: OrderActionItemOrderByWithRelationInput | OrderActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderActionItems.
     */
    cursor?: OrderActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderActionItems.
     */
    distinct?: OrderActionItemScalarFieldEnum | OrderActionItemScalarFieldEnum[]
  }

  /**
   * OrderActionItem findMany
   */
  export type OrderActionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderActionItems to fetch.
     */
    where?: OrderActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderActionItems to fetch.
     */
    orderBy?: OrderActionItemOrderByWithRelationInput | OrderActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderActionItems.
     */
    cursor?: OrderActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderActionItems.
     */
    distinct?: OrderActionItemScalarFieldEnum | OrderActionItemScalarFieldEnum[]
  }

  /**
   * OrderActionItem create
   */
  export type OrderActionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderActionItem.
     */
    data: XOR<OrderActionItemCreateInput, OrderActionItemUncheckedCreateInput>
  }

  /**
   * OrderActionItem createMany
   */
  export type OrderActionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderActionItems.
     */
    data: OrderActionItemCreateManyInput | OrderActionItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderActionItem createManyAndReturn
   */
  export type OrderActionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * The data used to create many OrderActionItems.
     */
    data: OrderActionItemCreateManyInput | OrderActionItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderActionItem update
   */
  export type OrderActionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderActionItem.
     */
    data: XOR<OrderActionItemUpdateInput, OrderActionItemUncheckedUpdateInput>
    /**
     * Choose, which OrderActionItem to update.
     */
    where: OrderActionItemWhereUniqueInput
  }

  /**
   * OrderActionItem updateMany
   */
  export type OrderActionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderActionItems.
     */
    data: XOR<OrderActionItemUpdateManyMutationInput, OrderActionItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderActionItems to update
     */
    where?: OrderActionItemWhereInput
    /**
     * Limit how many OrderActionItems to update.
     */
    limit?: number
  }

  /**
   * OrderActionItem updateManyAndReturn
   */
  export type OrderActionItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * The data used to update OrderActionItems.
     */
    data: XOR<OrderActionItemUpdateManyMutationInput, OrderActionItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderActionItems to update
     */
    where?: OrderActionItemWhereInput
    /**
     * Limit how many OrderActionItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderActionItem upsert
   */
  export type OrderActionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderActionItem to update in case it exists.
     */
    where: OrderActionItemWhereUniqueInput
    /**
     * In case the OrderActionItem found by the `where` argument doesn't exist, create a new OrderActionItem with this data.
     */
    create: XOR<OrderActionItemCreateInput, OrderActionItemUncheckedCreateInput>
    /**
     * In case the OrderActionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderActionItemUpdateInput, OrderActionItemUncheckedUpdateInput>
  }

  /**
   * OrderActionItem delete
   */
  export type OrderActionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
    /**
     * Filter which OrderActionItem to delete.
     */
    where: OrderActionItemWhereUniqueInput
  }

  /**
   * OrderActionItem deleteMany
   */
  export type OrderActionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderActionItems to delete
     */
    where?: OrderActionItemWhereInput
    /**
     * Limit how many OrderActionItems to delete.
     */
    limit?: number
  }

  /**
   * OrderActionItem without action
   */
  export type OrderActionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderActionItem
     */
    select?: OrderActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderActionItem
     */
    omit?: OrderActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderActionItemInclude<ExtArgs> | null
  }


  /**
   * Model RequestPayment
   */

  export type AggregateRequestPayment = {
    _count: RequestPaymentCountAggregateOutputType | null
    _avg: RequestPaymentAvgAggregateOutputType | null
    _sum: RequestPaymentSumAggregateOutputType | null
    _min: RequestPaymentMinAggregateOutputType | null
    _max: RequestPaymentMaxAggregateOutputType | null
  }

  export type RequestPaymentAvgAggregateOutputType = {
    amount: number | null
  }

  export type RequestPaymentSumAggregateOutputType = {
    amount: number | null
  }

  export type RequestPaymentMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    purpose: $Enums.PaymentPurpose | null
    provider: $Enums.PaymentProvider | null
    amount: number | null
    currency: string | null
    status: $Enums.PaymentStatus | null
    paymentLinkId: string | null
    paymentLinkUrl: string | null
    providerReferenceId: string | null
    paymentId: string | null
    paidAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RequestPaymentMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    purpose: $Enums.PaymentPurpose | null
    provider: $Enums.PaymentProvider | null
    amount: number | null
    currency: string | null
    status: $Enums.PaymentStatus | null
    paymentLinkId: string | null
    paymentLinkUrl: string | null
    providerReferenceId: string | null
    paymentId: string | null
    paidAt: Date | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RequestPaymentCountAggregateOutputType = {
    id: number
    requestId: number
    purpose: number
    provider: number
    amount: number
    currency: number
    status: number
    paymentLinkId: number
    paymentLinkUrl: number
    providerReferenceId: number
    paymentId: number
    paidAt: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RequestPaymentAvgAggregateInputType = {
    amount?: true
  }

  export type RequestPaymentSumAggregateInputType = {
    amount?: true
  }

  export type RequestPaymentMinAggregateInputType = {
    id?: true
    requestId?: true
    purpose?: true
    provider?: true
    amount?: true
    currency?: true
    status?: true
    paymentLinkId?: true
    paymentLinkUrl?: true
    providerReferenceId?: true
    paymentId?: true
    paidAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RequestPaymentMaxAggregateInputType = {
    id?: true
    requestId?: true
    purpose?: true
    provider?: true
    amount?: true
    currency?: true
    status?: true
    paymentLinkId?: true
    paymentLinkUrl?: true
    providerReferenceId?: true
    paymentId?: true
    paidAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RequestPaymentCountAggregateInputType = {
    id?: true
    requestId?: true
    purpose?: true
    provider?: true
    amount?: true
    currency?: true
    status?: true
    paymentLinkId?: true
    paymentLinkUrl?: true
    providerReferenceId?: true
    paymentId?: true
    paidAt?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RequestPaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestPayment to aggregate.
     */
    where?: RequestPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestPayments to fetch.
     */
    orderBy?: RequestPaymentOrderByWithRelationInput | RequestPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RequestPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RequestPayments
    **/
    _count?: true | RequestPaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RequestPaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RequestPaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequestPaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequestPaymentMaxAggregateInputType
  }

  export type GetRequestPaymentAggregateType<T extends RequestPaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateRequestPayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequestPayment[P]>
      : GetScalarType<T[P], AggregateRequestPayment[P]>
  }




  export type RequestPaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestPaymentWhereInput
    orderBy?: RequestPaymentOrderByWithAggregationInput | RequestPaymentOrderByWithAggregationInput[]
    by: RequestPaymentScalarFieldEnum[] | RequestPaymentScalarFieldEnum
    having?: RequestPaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequestPaymentCountAggregateInputType | true
    _avg?: RequestPaymentAvgAggregateInputType
    _sum?: RequestPaymentSumAggregateInputType
    _min?: RequestPaymentMinAggregateInputType
    _max?: RequestPaymentMaxAggregateInputType
  }

  export type RequestPaymentGroupByOutputType = {
    id: string
    requestId: string
    purpose: $Enums.PaymentPurpose
    provider: $Enums.PaymentProvider
    amount: number
    currency: string
    status: $Enums.PaymentStatus
    paymentLinkId: string | null
    paymentLinkUrl: string | null
    providerReferenceId: string | null
    paymentId: string | null
    paidAt: Date | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: RequestPaymentCountAggregateOutputType | null
    _avg: RequestPaymentAvgAggregateOutputType | null
    _sum: RequestPaymentSumAggregateOutputType | null
    _min: RequestPaymentMinAggregateOutputType | null
    _max: RequestPaymentMaxAggregateOutputType | null
  }

  type GetRequestPaymentGroupByPayload<T extends RequestPaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequestPaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequestPaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequestPaymentGroupByOutputType[P]>
            : GetScalarType<T[P], RequestPaymentGroupByOutputType[P]>
        }
      >
    >


  export type RequestPaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    purpose?: boolean
    provider?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paymentLinkId?: boolean
    paymentLinkUrl?: boolean
    providerReferenceId?: boolean
    paymentId?: boolean
    paidAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestPayment"]>

  export type RequestPaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    purpose?: boolean
    provider?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paymentLinkId?: boolean
    paymentLinkUrl?: boolean
    providerReferenceId?: boolean
    paymentId?: boolean
    paidAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestPayment"]>

  export type RequestPaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    purpose?: boolean
    provider?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paymentLinkId?: boolean
    paymentLinkUrl?: boolean
    providerReferenceId?: boolean
    paymentId?: boolean
    paidAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestPayment"]>

  export type RequestPaymentSelectScalar = {
    id?: boolean
    requestId?: boolean
    purpose?: boolean
    provider?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    paymentLinkId?: boolean
    paymentLinkUrl?: boolean
    providerReferenceId?: boolean
    paymentId?: boolean
    paidAt?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RequestPaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestId" | "purpose" | "provider" | "amount" | "currency" | "status" | "paymentLinkId" | "paymentLinkUrl" | "providerReferenceId" | "paymentId" | "paidAt" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["requestPayment"]>
  export type RequestPaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }
  export type RequestPaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }
  export type RequestPaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }

  export type $RequestPaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RequestPayment"
    objects: {
      request: Prisma.$OrderActionRequestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      purpose: $Enums.PaymentPurpose
      provider: $Enums.PaymentProvider
      amount: number
      currency: string
      status: $Enums.PaymentStatus
      paymentLinkId: string | null
      paymentLinkUrl: string | null
      providerReferenceId: string | null
      paymentId: string | null
      paidAt: Date | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["requestPayment"]>
    composites: {}
  }

  type RequestPaymentGetPayload<S extends boolean | null | undefined | RequestPaymentDefaultArgs> = $Result.GetResult<Prisma.$RequestPaymentPayload, S>

  type RequestPaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RequestPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequestPaymentCountAggregateInputType | true
    }

  export interface RequestPaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RequestPayment'], meta: { name: 'RequestPayment' } }
    /**
     * Find zero or one RequestPayment that matches the filter.
     * @param {RequestPaymentFindUniqueArgs} args - Arguments to find a RequestPayment
     * @example
     * // Get one RequestPayment
     * const requestPayment = await prisma.requestPayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RequestPaymentFindUniqueArgs>(args: SelectSubset<T, RequestPaymentFindUniqueArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RequestPayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RequestPaymentFindUniqueOrThrowArgs} args - Arguments to find a RequestPayment
     * @example
     * // Get one RequestPayment
     * const requestPayment = await prisma.requestPayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RequestPaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, RequestPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestPayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentFindFirstArgs} args - Arguments to find a RequestPayment
     * @example
     * // Get one RequestPayment
     * const requestPayment = await prisma.requestPayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RequestPaymentFindFirstArgs>(args?: SelectSubset<T, RequestPaymentFindFirstArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestPayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentFindFirstOrThrowArgs} args - Arguments to find a RequestPayment
     * @example
     * // Get one RequestPayment
     * const requestPayment = await prisma.requestPayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RequestPaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, RequestPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RequestPayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RequestPayments
     * const requestPayments = await prisma.requestPayment.findMany()
     * 
     * // Get first 10 RequestPayments
     * const requestPayments = await prisma.requestPayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requestPaymentWithIdOnly = await prisma.requestPayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RequestPaymentFindManyArgs>(args?: SelectSubset<T, RequestPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RequestPayment.
     * @param {RequestPaymentCreateArgs} args - Arguments to create a RequestPayment.
     * @example
     * // Create one RequestPayment
     * const RequestPayment = await prisma.requestPayment.create({
     *   data: {
     *     // ... data to create a RequestPayment
     *   }
     * })
     * 
     */
    create<T extends RequestPaymentCreateArgs>(args: SelectSubset<T, RequestPaymentCreateArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RequestPayments.
     * @param {RequestPaymentCreateManyArgs} args - Arguments to create many RequestPayments.
     * @example
     * // Create many RequestPayments
     * const requestPayment = await prisma.requestPayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RequestPaymentCreateManyArgs>(args?: SelectSubset<T, RequestPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RequestPayments and returns the data saved in the database.
     * @param {RequestPaymentCreateManyAndReturnArgs} args - Arguments to create many RequestPayments.
     * @example
     * // Create many RequestPayments
     * const requestPayment = await prisma.requestPayment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RequestPayments and only return the `id`
     * const requestPaymentWithIdOnly = await prisma.requestPayment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RequestPaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, RequestPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RequestPayment.
     * @param {RequestPaymentDeleteArgs} args - Arguments to delete one RequestPayment.
     * @example
     * // Delete one RequestPayment
     * const RequestPayment = await prisma.requestPayment.delete({
     *   where: {
     *     // ... filter to delete one RequestPayment
     *   }
     * })
     * 
     */
    delete<T extends RequestPaymentDeleteArgs>(args: SelectSubset<T, RequestPaymentDeleteArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RequestPayment.
     * @param {RequestPaymentUpdateArgs} args - Arguments to update one RequestPayment.
     * @example
     * // Update one RequestPayment
     * const requestPayment = await prisma.requestPayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RequestPaymentUpdateArgs>(args: SelectSubset<T, RequestPaymentUpdateArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RequestPayments.
     * @param {RequestPaymentDeleteManyArgs} args - Arguments to filter RequestPayments to delete.
     * @example
     * // Delete a few RequestPayments
     * const { count } = await prisma.requestPayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RequestPaymentDeleteManyArgs>(args?: SelectSubset<T, RequestPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RequestPayments
     * const requestPayment = await prisma.requestPayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RequestPaymentUpdateManyArgs>(args: SelectSubset<T, RequestPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestPayments and returns the data updated in the database.
     * @param {RequestPaymentUpdateManyAndReturnArgs} args - Arguments to update many RequestPayments.
     * @example
     * // Update many RequestPayments
     * const requestPayment = await prisma.requestPayment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RequestPayments and only return the `id`
     * const requestPaymentWithIdOnly = await prisma.requestPayment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RequestPaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, RequestPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RequestPayment.
     * @param {RequestPaymentUpsertArgs} args - Arguments to update or create a RequestPayment.
     * @example
     * // Update or create a RequestPayment
     * const requestPayment = await prisma.requestPayment.upsert({
     *   create: {
     *     // ... data to create a RequestPayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RequestPayment we want to update
     *   }
     * })
     */
    upsert<T extends RequestPaymentUpsertArgs>(args: SelectSubset<T, RequestPaymentUpsertArgs<ExtArgs>>): Prisma__RequestPaymentClient<$Result.GetResult<Prisma.$RequestPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RequestPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentCountArgs} args - Arguments to filter RequestPayments to count.
     * @example
     * // Count the number of RequestPayments
     * const count = await prisma.requestPayment.count({
     *   where: {
     *     // ... the filter for the RequestPayments we want to count
     *   }
     * })
    **/
    count<T extends RequestPaymentCountArgs>(
      args?: Subset<T, RequestPaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequestPaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RequestPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequestPaymentAggregateArgs>(args: Subset<T, RequestPaymentAggregateArgs>): Prisma.PrismaPromise<GetRequestPaymentAggregateType<T>>

    /**
     * Group by RequestPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestPaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RequestPaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RequestPaymentGroupByArgs['orderBy'] }
        : { orderBy?: RequestPaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RequestPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RequestPayment model
   */
  readonly fields: RequestPaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RequestPayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RequestPaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends OrderActionRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderActionRequestDefaultArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RequestPayment model
   */
  interface RequestPaymentFieldRefs {
    readonly id: FieldRef<"RequestPayment", 'String'>
    readonly requestId: FieldRef<"RequestPayment", 'String'>
    readonly purpose: FieldRef<"RequestPayment", 'PaymentPurpose'>
    readonly provider: FieldRef<"RequestPayment", 'PaymentProvider'>
    readonly amount: FieldRef<"RequestPayment", 'Int'>
    readonly currency: FieldRef<"RequestPayment", 'String'>
    readonly status: FieldRef<"RequestPayment", 'PaymentStatus'>
    readonly paymentLinkId: FieldRef<"RequestPayment", 'String'>
    readonly paymentLinkUrl: FieldRef<"RequestPayment", 'String'>
    readonly providerReferenceId: FieldRef<"RequestPayment", 'String'>
    readonly paymentId: FieldRef<"RequestPayment", 'String'>
    readonly paidAt: FieldRef<"RequestPayment", 'DateTime'>
    readonly expiresAt: FieldRef<"RequestPayment", 'DateTime'>
    readonly createdAt: FieldRef<"RequestPayment", 'DateTime'>
    readonly updatedAt: FieldRef<"RequestPayment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RequestPayment findUnique
   */
  export type RequestPaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * Filter, which RequestPayment to fetch.
     */
    where: RequestPaymentWhereUniqueInput
  }

  /**
   * RequestPayment findUniqueOrThrow
   */
  export type RequestPaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * Filter, which RequestPayment to fetch.
     */
    where: RequestPaymentWhereUniqueInput
  }

  /**
   * RequestPayment findFirst
   */
  export type RequestPaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * Filter, which RequestPayment to fetch.
     */
    where?: RequestPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestPayments to fetch.
     */
    orderBy?: RequestPaymentOrderByWithRelationInput | RequestPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestPayments.
     */
    cursor?: RequestPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestPayments.
     */
    distinct?: RequestPaymentScalarFieldEnum | RequestPaymentScalarFieldEnum[]
  }

  /**
   * RequestPayment findFirstOrThrow
   */
  export type RequestPaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * Filter, which RequestPayment to fetch.
     */
    where?: RequestPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestPayments to fetch.
     */
    orderBy?: RequestPaymentOrderByWithRelationInput | RequestPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestPayments.
     */
    cursor?: RequestPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestPayments.
     */
    distinct?: RequestPaymentScalarFieldEnum | RequestPaymentScalarFieldEnum[]
  }

  /**
   * RequestPayment findMany
   */
  export type RequestPaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * Filter, which RequestPayments to fetch.
     */
    where?: RequestPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestPayments to fetch.
     */
    orderBy?: RequestPaymentOrderByWithRelationInput | RequestPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RequestPayments.
     */
    cursor?: RequestPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestPayments.
     */
    distinct?: RequestPaymentScalarFieldEnum | RequestPaymentScalarFieldEnum[]
  }

  /**
   * RequestPayment create
   */
  export type RequestPaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a RequestPayment.
     */
    data: XOR<RequestPaymentCreateInput, RequestPaymentUncheckedCreateInput>
  }

  /**
   * RequestPayment createMany
   */
  export type RequestPaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RequestPayments.
     */
    data: RequestPaymentCreateManyInput | RequestPaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RequestPayment createManyAndReturn
   */
  export type RequestPaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * The data used to create many RequestPayments.
     */
    data: RequestPaymentCreateManyInput | RequestPaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RequestPayment update
   */
  export type RequestPaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a RequestPayment.
     */
    data: XOR<RequestPaymentUpdateInput, RequestPaymentUncheckedUpdateInput>
    /**
     * Choose, which RequestPayment to update.
     */
    where: RequestPaymentWhereUniqueInput
  }

  /**
   * RequestPayment updateMany
   */
  export type RequestPaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RequestPayments.
     */
    data: XOR<RequestPaymentUpdateManyMutationInput, RequestPaymentUncheckedUpdateManyInput>
    /**
     * Filter which RequestPayments to update
     */
    where?: RequestPaymentWhereInput
    /**
     * Limit how many RequestPayments to update.
     */
    limit?: number
  }

  /**
   * RequestPayment updateManyAndReturn
   */
  export type RequestPaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * The data used to update RequestPayments.
     */
    data: XOR<RequestPaymentUpdateManyMutationInput, RequestPaymentUncheckedUpdateManyInput>
    /**
     * Filter which RequestPayments to update
     */
    where?: RequestPaymentWhereInput
    /**
     * Limit how many RequestPayments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RequestPayment upsert
   */
  export type RequestPaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the RequestPayment to update in case it exists.
     */
    where: RequestPaymentWhereUniqueInput
    /**
     * In case the RequestPayment found by the `where` argument doesn't exist, create a new RequestPayment with this data.
     */
    create: XOR<RequestPaymentCreateInput, RequestPaymentUncheckedCreateInput>
    /**
     * In case the RequestPayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RequestPaymentUpdateInput, RequestPaymentUncheckedUpdateInput>
  }

  /**
   * RequestPayment delete
   */
  export type RequestPaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
    /**
     * Filter which RequestPayment to delete.
     */
    where: RequestPaymentWhereUniqueInput
  }

  /**
   * RequestPayment deleteMany
   */
  export type RequestPaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestPayments to delete
     */
    where?: RequestPaymentWhereInput
    /**
     * Limit how many RequestPayments to delete.
     */
    limit?: number
  }

  /**
   * RequestPayment without action
   */
  export type RequestPaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestPayment
     */
    select?: RequestPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestPayment
     */
    omit?: RequestPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestPaymentInclude<ExtArgs> | null
  }


  /**
   * Model ShipmentTracking
   */

  export type AggregateShipmentTracking = {
    _count: ShipmentTrackingCountAggregateOutputType | null
    _min: ShipmentTrackingMinAggregateOutputType | null
    _max: ShipmentTrackingMaxAggregateOutputType | null
  }

  export type ShipmentTrackingMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    direction: $Enums.ShipmentDirection | null
    carrier: string | null
    awb: string | null
    trackingUrl: string | null
    status: $Enums.ShipmentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShipmentTrackingMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    direction: $Enums.ShipmentDirection | null
    carrier: string | null
    awb: string | null
    trackingUrl: string | null
    status: $Enums.ShipmentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShipmentTrackingCountAggregateOutputType = {
    id: number
    requestId: number
    direction: number
    carrier: number
    awb: number
    trackingUrl: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShipmentTrackingMinAggregateInputType = {
    id?: true
    requestId?: true
    direction?: true
    carrier?: true
    awb?: true
    trackingUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShipmentTrackingMaxAggregateInputType = {
    id?: true
    requestId?: true
    direction?: true
    carrier?: true
    awb?: true
    trackingUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShipmentTrackingCountAggregateInputType = {
    id?: true
    requestId?: true
    direction?: true
    carrier?: true
    awb?: true
    trackingUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ShipmentTrackingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentTracking to aggregate.
     */
    where?: ShipmentTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentTrackings to fetch.
     */
    orderBy?: ShipmentTrackingOrderByWithRelationInput | ShipmentTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShipmentTrackings
    **/
    _count?: true | ShipmentTrackingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentTrackingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentTrackingMaxAggregateInputType
  }

  export type GetShipmentTrackingAggregateType<T extends ShipmentTrackingAggregateArgs> = {
        [P in keyof T & keyof AggregateShipmentTracking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipmentTracking[P]>
      : GetScalarType<T[P], AggregateShipmentTracking[P]>
  }




  export type ShipmentTrackingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentTrackingWhereInput
    orderBy?: ShipmentTrackingOrderByWithAggregationInput | ShipmentTrackingOrderByWithAggregationInput[]
    by: ShipmentTrackingScalarFieldEnum[] | ShipmentTrackingScalarFieldEnum
    having?: ShipmentTrackingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentTrackingCountAggregateInputType | true
    _min?: ShipmentTrackingMinAggregateInputType
    _max?: ShipmentTrackingMaxAggregateInputType
  }

  export type ShipmentTrackingGroupByOutputType = {
    id: string
    requestId: string
    direction: $Enums.ShipmentDirection
    carrier: string | null
    awb: string | null
    trackingUrl: string | null
    status: $Enums.ShipmentStatus
    createdAt: Date
    updatedAt: Date
    _count: ShipmentTrackingCountAggregateOutputType | null
    _min: ShipmentTrackingMinAggregateOutputType | null
    _max: ShipmentTrackingMaxAggregateOutputType | null
  }

  type GetShipmentTrackingGroupByPayload<T extends ShipmentTrackingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentTrackingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentTrackingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentTrackingGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentTrackingGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentTrackingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    direction?: boolean
    carrier?: boolean
    awb?: boolean
    trackingUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentTracking"]>

  export type ShipmentTrackingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    direction?: boolean
    carrier?: boolean
    awb?: boolean
    trackingUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentTracking"]>

  export type ShipmentTrackingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    direction?: boolean
    carrier?: boolean
    awb?: boolean
    trackingUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentTracking"]>

  export type ShipmentTrackingSelectScalar = {
    id?: boolean
    requestId?: boolean
    direction?: boolean
    carrier?: boolean
    awb?: boolean
    trackingUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShipmentTrackingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestId" | "direction" | "carrier" | "awb" | "trackingUrl" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["shipmentTracking"]>
  export type ShipmentTrackingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }
  export type ShipmentTrackingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }
  export type ShipmentTrackingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | OrderActionRequestDefaultArgs<ExtArgs>
  }

  export type $ShipmentTrackingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShipmentTracking"
    objects: {
      request: Prisma.$OrderActionRequestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      direction: $Enums.ShipmentDirection
      carrier: string | null
      awb: string | null
      trackingUrl: string | null
      status: $Enums.ShipmentStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["shipmentTracking"]>
    composites: {}
  }

  type ShipmentTrackingGetPayload<S extends boolean | null | undefined | ShipmentTrackingDefaultArgs> = $Result.GetResult<Prisma.$ShipmentTrackingPayload, S>

  type ShipmentTrackingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentTrackingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentTrackingCountAggregateInputType | true
    }

  export interface ShipmentTrackingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShipmentTracking'], meta: { name: 'ShipmentTracking' } }
    /**
     * Find zero or one ShipmentTracking that matches the filter.
     * @param {ShipmentTrackingFindUniqueArgs} args - Arguments to find a ShipmentTracking
     * @example
     * // Get one ShipmentTracking
     * const shipmentTracking = await prisma.shipmentTracking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentTrackingFindUniqueArgs>(args: SelectSubset<T, ShipmentTrackingFindUniqueArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShipmentTracking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentTrackingFindUniqueOrThrowArgs} args - Arguments to find a ShipmentTracking
     * @example
     * // Get one ShipmentTracking
     * const shipmentTracking = await prisma.shipmentTracking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentTrackingFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentTrackingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentTracking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingFindFirstArgs} args - Arguments to find a ShipmentTracking
     * @example
     * // Get one ShipmentTracking
     * const shipmentTracking = await prisma.shipmentTracking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentTrackingFindFirstArgs>(args?: SelectSubset<T, ShipmentTrackingFindFirstArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentTracking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingFindFirstOrThrowArgs} args - Arguments to find a ShipmentTracking
     * @example
     * // Get one ShipmentTracking
     * const shipmentTracking = await prisma.shipmentTracking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentTrackingFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentTrackingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShipmentTrackings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShipmentTrackings
     * const shipmentTrackings = await prisma.shipmentTracking.findMany()
     * 
     * // Get first 10 ShipmentTrackings
     * const shipmentTrackings = await prisma.shipmentTracking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentTrackingWithIdOnly = await prisma.shipmentTracking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentTrackingFindManyArgs>(args?: SelectSubset<T, ShipmentTrackingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShipmentTracking.
     * @param {ShipmentTrackingCreateArgs} args - Arguments to create a ShipmentTracking.
     * @example
     * // Create one ShipmentTracking
     * const ShipmentTracking = await prisma.shipmentTracking.create({
     *   data: {
     *     // ... data to create a ShipmentTracking
     *   }
     * })
     * 
     */
    create<T extends ShipmentTrackingCreateArgs>(args: SelectSubset<T, ShipmentTrackingCreateArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShipmentTrackings.
     * @param {ShipmentTrackingCreateManyArgs} args - Arguments to create many ShipmentTrackings.
     * @example
     * // Create many ShipmentTrackings
     * const shipmentTracking = await prisma.shipmentTracking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentTrackingCreateManyArgs>(args?: SelectSubset<T, ShipmentTrackingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShipmentTrackings and returns the data saved in the database.
     * @param {ShipmentTrackingCreateManyAndReturnArgs} args - Arguments to create many ShipmentTrackings.
     * @example
     * // Create many ShipmentTrackings
     * const shipmentTracking = await prisma.shipmentTracking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShipmentTrackings and only return the `id`
     * const shipmentTrackingWithIdOnly = await prisma.shipmentTracking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentTrackingCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentTrackingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShipmentTracking.
     * @param {ShipmentTrackingDeleteArgs} args - Arguments to delete one ShipmentTracking.
     * @example
     * // Delete one ShipmentTracking
     * const ShipmentTracking = await prisma.shipmentTracking.delete({
     *   where: {
     *     // ... filter to delete one ShipmentTracking
     *   }
     * })
     * 
     */
    delete<T extends ShipmentTrackingDeleteArgs>(args: SelectSubset<T, ShipmentTrackingDeleteArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShipmentTracking.
     * @param {ShipmentTrackingUpdateArgs} args - Arguments to update one ShipmentTracking.
     * @example
     * // Update one ShipmentTracking
     * const shipmentTracking = await prisma.shipmentTracking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentTrackingUpdateArgs>(args: SelectSubset<T, ShipmentTrackingUpdateArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShipmentTrackings.
     * @param {ShipmentTrackingDeleteManyArgs} args - Arguments to filter ShipmentTrackings to delete.
     * @example
     * // Delete a few ShipmentTrackings
     * const { count } = await prisma.shipmentTracking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentTrackingDeleteManyArgs>(args?: SelectSubset<T, ShipmentTrackingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShipmentTrackings
     * const shipmentTracking = await prisma.shipmentTracking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentTrackingUpdateManyArgs>(args: SelectSubset<T, ShipmentTrackingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentTrackings and returns the data updated in the database.
     * @param {ShipmentTrackingUpdateManyAndReturnArgs} args - Arguments to update many ShipmentTrackings.
     * @example
     * // Update many ShipmentTrackings
     * const shipmentTracking = await prisma.shipmentTracking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShipmentTrackings and only return the `id`
     * const shipmentTrackingWithIdOnly = await prisma.shipmentTracking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentTrackingUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentTrackingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShipmentTracking.
     * @param {ShipmentTrackingUpsertArgs} args - Arguments to update or create a ShipmentTracking.
     * @example
     * // Update or create a ShipmentTracking
     * const shipmentTracking = await prisma.shipmentTracking.upsert({
     *   create: {
     *     // ... data to create a ShipmentTracking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShipmentTracking we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentTrackingUpsertArgs>(args: SelectSubset<T, ShipmentTrackingUpsertArgs<ExtArgs>>): Prisma__ShipmentTrackingClient<$Result.GetResult<Prisma.$ShipmentTrackingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShipmentTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingCountArgs} args - Arguments to filter ShipmentTrackings to count.
     * @example
     * // Count the number of ShipmentTrackings
     * const count = await prisma.shipmentTracking.count({
     *   where: {
     *     // ... the filter for the ShipmentTrackings we want to count
     *   }
     * })
    **/
    count<T extends ShipmentTrackingCountArgs>(
      args?: Subset<T, ShipmentTrackingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentTrackingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShipmentTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentTrackingAggregateArgs>(args: Subset<T, ShipmentTrackingAggregateArgs>): Prisma.PrismaPromise<GetShipmentTrackingAggregateType<T>>

    /**
     * Group by ShipmentTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentTrackingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentTrackingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentTrackingGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentTrackingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentTrackingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentTrackingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShipmentTracking model
   */
  readonly fields: ShipmentTrackingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShipmentTracking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentTrackingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends OrderActionRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderActionRequestDefaultArgs<ExtArgs>>): Prisma__OrderActionRequestClient<$Result.GetResult<Prisma.$OrderActionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShipmentTracking model
   */
  interface ShipmentTrackingFieldRefs {
    readonly id: FieldRef<"ShipmentTracking", 'String'>
    readonly requestId: FieldRef<"ShipmentTracking", 'String'>
    readonly direction: FieldRef<"ShipmentTracking", 'ShipmentDirection'>
    readonly carrier: FieldRef<"ShipmentTracking", 'String'>
    readonly awb: FieldRef<"ShipmentTracking", 'String'>
    readonly trackingUrl: FieldRef<"ShipmentTracking", 'String'>
    readonly status: FieldRef<"ShipmentTracking", 'ShipmentStatus'>
    readonly createdAt: FieldRef<"ShipmentTracking", 'DateTime'>
    readonly updatedAt: FieldRef<"ShipmentTracking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShipmentTracking findUnique
   */
  export type ShipmentTrackingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentTracking to fetch.
     */
    where: ShipmentTrackingWhereUniqueInput
  }

  /**
   * ShipmentTracking findUniqueOrThrow
   */
  export type ShipmentTrackingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentTracking to fetch.
     */
    where: ShipmentTrackingWhereUniqueInput
  }

  /**
   * ShipmentTracking findFirst
   */
  export type ShipmentTrackingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentTracking to fetch.
     */
    where?: ShipmentTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentTrackings to fetch.
     */
    orderBy?: ShipmentTrackingOrderByWithRelationInput | ShipmentTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentTrackings.
     */
    cursor?: ShipmentTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentTrackings.
     */
    distinct?: ShipmentTrackingScalarFieldEnum | ShipmentTrackingScalarFieldEnum[]
  }

  /**
   * ShipmentTracking findFirstOrThrow
   */
  export type ShipmentTrackingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentTracking to fetch.
     */
    where?: ShipmentTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentTrackings to fetch.
     */
    orderBy?: ShipmentTrackingOrderByWithRelationInput | ShipmentTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentTrackings.
     */
    cursor?: ShipmentTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentTrackings.
     */
    distinct?: ShipmentTrackingScalarFieldEnum | ShipmentTrackingScalarFieldEnum[]
  }

  /**
   * ShipmentTracking findMany
   */
  export type ShipmentTrackingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentTrackings to fetch.
     */
    where?: ShipmentTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentTrackings to fetch.
     */
    orderBy?: ShipmentTrackingOrderByWithRelationInput | ShipmentTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShipmentTrackings.
     */
    cursor?: ShipmentTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentTrackings.
     */
    distinct?: ShipmentTrackingScalarFieldEnum | ShipmentTrackingScalarFieldEnum[]
  }

  /**
   * ShipmentTracking create
   */
  export type ShipmentTrackingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * The data needed to create a ShipmentTracking.
     */
    data: XOR<ShipmentTrackingCreateInput, ShipmentTrackingUncheckedCreateInput>
  }

  /**
   * ShipmentTracking createMany
   */
  export type ShipmentTrackingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShipmentTrackings.
     */
    data: ShipmentTrackingCreateManyInput | ShipmentTrackingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShipmentTracking createManyAndReturn
   */
  export type ShipmentTrackingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * The data used to create many ShipmentTrackings.
     */
    data: ShipmentTrackingCreateManyInput | ShipmentTrackingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentTracking update
   */
  export type ShipmentTrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * The data needed to update a ShipmentTracking.
     */
    data: XOR<ShipmentTrackingUpdateInput, ShipmentTrackingUncheckedUpdateInput>
    /**
     * Choose, which ShipmentTracking to update.
     */
    where: ShipmentTrackingWhereUniqueInput
  }

  /**
   * ShipmentTracking updateMany
   */
  export type ShipmentTrackingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShipmentTrackings.
     */
    data: XOR<ShipmentTrackingUpdateManyMutationInput, ShipmentTrackingUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentTrackings to update
     */
    where?: ShipmentTrackingWhereInput
    /**
     * Limit how many ShipmentTrackings to update.
     */
    limit?: number
  }

  /**
   * ShipmentTracking updateManyAndReturn
   */
  export type ShipmentTrackingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * The data used to update ShipmentTrackings.
     */
    data: XOR<ShipmentTrackingUpdateManyMutationInput, ShipmentTrackingUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentTrackings to update
     */
    where?: ShipmentTrackingWhereInput
    /**
     * Limit how many ShipmentTrackings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentTracking upsert
   */
  export type ShipmentTrackingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * The filter to search for the ShipmentTracking to update in case it exists.
     */
    where: ShipmentTrackingWhereUniqueInput
    /**
     * In case the ShipmentTracking found by the `where` argument doesn't exist, create a new ShipmentTracking with this data.
     */
    create: XOR<ShipmentTrackingCreateInput, ShipmentTrackingUncheckedCreateInput>
    /**
     * In case the ShipmentTracking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentTrackingUpdateInput, ShipmentTrackingUncheckedUpdateInput>
  }

  /**
   * ShipmentTracking delete
   */
  export type ShipmentTrackingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
    /**
     * Filter which ShipmentTracking to delete.
     */
    where: ShipmentTrackingWhereUniqueInput
  }

  /**
   * ShipmentTracking deleteMany
   */
  export type ShipmentTrackingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentTrackings to delete
     */
    where?: ShipmentTrackingWhereInput
    /**
     * Limit how many ShipmentTrackings to delete.
     */
    limit?: number
  }

  /**
   * ShipmentTracking without action
   */
  export type ShipmentTrackingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentTracking
     */
    select?: ShipmentTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentTracking
     */
    omit?: ShipmentTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentTrackingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CustomerProfileScalarFieldEnum: {
    id: 'id',
    phoneE164: 'phoneE164',
    fullName: 'fullName',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    stateProvince: 'stateProvince',
    postalCode: 'postalCode',
    countryRegion: 'countryRegion',
    shopifyCustomerId: 'shopifyCustomerId',
    phoneVerifiedAt: 'phoneVerifiedAt',
    profileCompletedAt: 'profileCompletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerProfileScalarFieldEnum = (typeof CustomerProfileScalarFieldEnum)[keyof typeof CustomerProfileScalarFieldEnum]


  export const AuthSessionScalarFieldEnum: {
    id: 'id',
    customerProfileId: 'customerProfileId',
    sessionTokenHash: 'sessionTokenHash',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    lastSeenAt: 'lastSeenAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthSessionScalarFieldEnum = (typeof AuthSessionScalarFieldEnum)[keyof typeof AuthSessionScalarFieldEnum]


  export const OTPChallengeScalarFieldEnum: {
    id: 'id',
    phoneE164: 'phoneE164',
    provider: 'provider',
    providerSid: 'providerSid',
    status: 'status',
    attemptsCount: 'attemptsCount',
    requestedAt: 'requestedAt',
    verifiedAt: 'verifiedAt',
    expiresAt: 'expiresAt',
    metadata: 'metadata',
    createdAt: 'createdAt',
    customerProfileId: 'customerProfileId'
  };

  export type OTPChallengeScalarFieldEnum = (typeof OTPChallengeScalarFieldEnum)[keyof typeof OTPChallengeScalarFieldEnum]


  export const AuditEventScalarFieldEnum: {
    id: 'id',
    actorType: 'actorType',
    actorId: 'actorId',
    eventType: 'eventType',
    entityType: 'entityType',
    entityId: 'entityId',
    payload: 'payload',
    createdAt: 'createdAt'
  };

  export type AuditEventScalarFieldEnum = (typeof AuditEventScalarFieldEnum)[keyof typeof AuditEventScalarFieldEnum]


  export const OrderActionRequestScalarFieldEnum: {
    id: 'id',
    requestType: 'requestType',
    customerProfileId: 'customerProfileId',
    shopifyCustomerId: 'shopifyCustomerId',
    shopifyOrderId: 'shopifyOrderId',
    orderNumber: 'orderNumber',
    status: 'status',
    reason: 'reason',
    customerNote: 'customerNote',
    adminNote: 'adminNote',
    requestedAt: 'requestedAt',
    updatedAt: 'updatedAt',
    customerNameSnapshot: 'customerNameSnapshot',
    customerPhoneSnapshot: 'customerPhoneSnapshot',
    customerEmailSnapshot: 'customerEmailSnapshot',
    orderAmountSnapshot: 'orderAmountSnapshot',
    deliveryDateSnapshot: 'deliveryDateSnapshot',
    eligibilityDecision: 'eligibilityDecision',
    eligibilityReason: 'eligibilityReason'
  };

  export type OrderActionRequestScalarFieldEnum = (typeof OrderActionRequestScalarFieldEnum)[keyof typeof OrderActionRequestScalarFieldEnum]


  export const OrderActionItemScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    shopifyLineItemId: 'shopifyLineItemId',
    productTitle: 'productTitle',
    variantTitle: 'variantTitle',
    sku: 'sku',
    currentSize: 'currentSize',
    requestedSize: 'requestedSize',
    quantity: 'quantity',
    isClearance: 'isClearance',
    isExcludedCategory: 'isExcludedCategory',
    eligibilitySnapshot: 'eligibilitySnapshot',
    createdAt: 'createdAt'
  };

  export type OrderActionItemScalarFieldEnum = (typeof OrderActionItemScalarFieldEnum)[keyof typeof OrderActionItemScalarFieldEnum]


  export const RequestPaymentScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    purpose: 'purpose',
    provider: 'provider',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    paymentLinkId: 'paymentLinkId',
    paymentLinkUrl: 'paymentLinkUrl',
    providerReferenceId: 'providerReferenceId',
    paymentId: 'paymentId',
    paidAt: 'paidAt',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RequestPaymentScalarFieldEnum = (typeof RequestPaymentScalarFieldEnum)[keyof typeof RequestPaymentScalarFieldEnum]


  export const ShipmentTrackingScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    direction: 'direction',
    carrier: 'carrier',
    awb: 'awb',
    trackingUrl: 'trackingUrl',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ShipmentTrackingScalarFieldEnum = (typeof ShipmentTrackingScalarFieldEnum)[keyof typeof ShipmentTrackingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'RequestType'
   */
  export type EnumRequestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestType'>
    


  /**
   * Reference to a field of type 'RequestType[]'
   */
  export type ListEnumRequestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestType[]'>
    


  /**
   * Reference to a field of type 'ExchangeRequestStatus'
   */
  export type EnumExchangeRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExchangeRequestStatus'>
    


  /**
   * Reference to a field of type 'ExchangeRequestStatus[]'
   */
  export type ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExchangeRequestStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'PaymentPurpose'
   */
  export type EnumPaymentPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentPurpose'>
    


  /**
   * Reference to a field of type 'PaymentPurpose[]'
   */
  export type ListEnumPaymentPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentPurpose[]'>
    


  /**
   * Reference to a field of type 'PaymentProvider'
   */
  export type EnumPaymentProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentProvider'>
    


  /**
   * Reference to a field of type 'PaymentProvider[]'
   */
  export type ListEnumPaymentProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentProvider[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'ShipmentDirection'
   */
  export type EnumShipmentDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentDirection'>
    


  /**
   * Reference to a field of type 'ShipmentDirection[]'
   */
  export type ListEnumShipmentDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentDirection[]'>
    


  /**
   * Reference to a field of type 'ShipmentStatus'
   */
  export type EnumShipmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentStatus'>
    


  /**
   * Reference to a field of type 'ShipmentStatus[]'
   */
  export type ListEnumShipmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CustomerProfileWhereInput = {
    AND?: CustomerProfileWhereInput | CustomerProfileWhereInput[]
    OR?: CustomerProfileWhereInput[]
    NOT?: CustomerProfileWhereInput | CustomerProfileWhereInput[]
    id?: StringFilter<"CustomerProfile"> | string
    phoneE164?: StringFilter<"CustomerProfile"> | string
    fullName?: StringNullableFilter<"CustomerProfile"> | string | null
    firstName?: StringNullableFilter<"CustomerProfile"> | string | null
    lastName?: StringNullableFilter<"CustomerProfile"> | string | null
    email?: StringNullableFilter<"CustomerProfile"> | string | null
    addressLine1?: StringNullableFilter<"CustomerProfile"> | string | null
    addressLine2?: StringNullableFilter<"CustomerProfile"> | string | null
    city?: StringNullableFilter<"CustomerProfile"> | string | null
    stateProvince?: StringNullableFilter<"CustomerProfile"> | string | null
    postalCode?: StringNullableFilter<"CustomerProfile"> | string | null
    countryRegion?: StringNullableFilter<"CustomerProfile"> | string | null
    shopifyCustomerId?: StringNullableFilter<"CustomerProfile"> | string | null
    phoneVerifiedAt?: DateTimeNullableFilter<"CustomerProfile"> | Date | string | null
    profileCompletedAt?: DateTimeNullableFilter<"CustomerProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"CustomerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerProfile"> | Date | string
    sessions?: AuthSessionListRelationFilter
    otpChallenges?: OTPChallengeListRelationFilter
    orderActionRequests?: OrderActionRequestListRelationFilter
  }

  export type CustomerProfileOrderByWithRelationInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    fullName?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    addressLine1?: SortOrderInput | SortOrder
    addressLine2?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    stateProvince?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    countryRegion?: SortOrderInput | SortOrder
    shopifyCustomerId?: SortOrderInput | SortOrder
    phoneVerifiedAt?: SortOrderInput | SortOrder
    profileCompletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: AuthSessionOrderByRelationAggregateInput
    otpChallenges?: OTPChallengeOrderByRelationAggregateInput
    orderActionRequests?: OrderActionRequestOrderByRelationAggregateInput
  }

  export type CustomerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phoneE164?: string
    AND?: CustomerProfileWhereInput | CustomerProfileWhereInput[]
    OR?: CustomerProfileWhereInput[]
    NOT?: CustomerProfileWhereInput | CustomerProfileWhereInput[]
    fullName?: StringNullableFilter<"CustomerProfile"> | string | null
    firstName?: StringNullableFilter<"CustomerProfile"> | string | null
    lastName?: StringNullableFilter<"CustomerProfile"> | string | null
    email?: StringNullableFilter<"CustomerProfile"> | string | null
    addressLine1?: StringNullableFilter<"CustomerProfile"> | string | null
    addressLine2?: StringNullableFilter<"CustomerProfile"> | string | null
    city?: StringNullableFilter<"CustomerProfile"> | string | null
    stateProvince?: StringNullableFilter<"CustomerProfile"> | string | null
    postalCode?: StringNullableFilter<"CustomerProfile"> | string | null
    countryRegion?: StringNullableFilter<"CustomerProfile"> | string | null
    shopifyCustomerId?: StringNullableFilter<"CustomerProfile"> | string | null
    phoneVerifiedAt?: DateTimeNullableFilter<"CustomerProfile"> | Date | string | null
    profileCompletedAt?: DateTimeNullableFilter<"CustomerProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"CustomerProfile"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerProfile"> | Date | string
    sessions?: AuthSessionListRelationFilter
    otpChallenges?: OTPChallengeListRelationFilter
    orderActionRequests?: OrderActionRequestListRelationFilter
  }, "id" | "phoneE164">

  export type CustomerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    fullName?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    addressLine1?: SortOrderInput | SortOrder
    addressLine2?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    stateProvince?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    countryRegion?: SortOrderInput | SortOrder
    shopifyCustomerId?: SortOrderInput | SortOrder
    phoneVerifiedAt?: SortOrderInput | SortOrder
    profileCompletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerProfileCountOrderByAggregateInput
    _max?: CustomerProfileMaxOrderByAggregateInput
    _min?: CustomerProfileMinOrderByAggregateInput
  }

  export type CustomerProfileScalarWhereWithAggregatesInput = {
    AND?: CustomerProfileScalarWhereWithAggregatesInput | CustomerProfileScalarWhereWithAggregatesInput[]
    OR?: CustomerProfileScalarWhereWithAggregatesInput[]
    NOT?: CustomerProfileScalarWhereWithAggregatesInput | CustomerProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomerProfile"> | string
    phoneE164?: StringWithAggregatesFilter<"CustomerProfile"> | string
    fullName?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    email?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    addressLine1?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    addressLine2?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    city?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    stateProvince?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    countryRegion?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    shopifyCustomerId?: StringNullableWithAggregatesFilter<"CustomerProfile"> | string | null
    phoneVerifiedAt?: DateTimeNullableWithAggregatesFilter<"CustomerProfile"> | Date | string | null
    profileCompletedAt?: DateTimeNullableWithAggregatesFilter<"CustomerProfile"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CustomerProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CustomerProfile"> | Date | string
  }

  export type AuthSessionWhereInput = {
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    id?: StringFilter<"AuthSession"> | string
    customerProfileId?: StringFilter<"AuthSession"> | string
    sessionTokenHash?: StringFilter<"AuthSession"> | string
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    lastSeenAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    customer?: XOR<CustomerProfileScalarRelationFilter, CustomerProfileWhereInput>
  }

  export type AuthSessionOrderByWithRelationInput = {
    id?: SortOrder
    customerProfileId?: SortOrder
    sessionTokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerProfileOrderByWithRelationInput
  }

  export type AuthSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionTokenHash?: string
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    customerProfileId?: StringFilter<"AuthSession"> | string
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    lastSeenAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    customer?: XOR<CustomerProfileScalarRelationFilter, CustomerProfileWhereInput>
  }, "id" | "sessionTokenHash">

  export type AuthSessionOrderByWithAggregationInput = {
    id?: SortOrder
    customerProfileId?: SortOrder
    sessionTokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthSessionCountOrderByAggregateInput
    _max?: AuthSessionMaxOrderByAggregateInput
    _min?: AuthSessionMinOrderByAggregateInput
  }

  export type AuthSessionScalarWhereWithAggregatesInput = {
    AND?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    OR?: AuthSessionScalarWhereWithAggregatesInput[]
    NOT?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthSession"> | string
    customerProfileId?: StringWithAggregatesFilter<"AuthSession"> | string
    sessionTokenHash?: StringWithAggregatesFilter<"AuthSession"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"AuthSession"> | Date | string | null
    lastSeenAt?: DateTimeNullableWithAggregatesFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
  }

  export type OTPChallengeWhereInput = {
    AND?: OTPChallengeWhereInput | OTPChallengeWhereInput[]
    OR?: OTPChallengeWhereInput[]
    NOT?: OTPChallengeWhereInput | OTPChallengeWhereInput[]
    id?: StringFilter<"OTPChallenge"> | string
    phoneE164?: StringFilter<"OTPChallenge"> | string
    provider?: StringFilter<"OTPChallenge"> | string
    providerSid?: StringNullableFilter<"OTPChallenge"> | string | null
    status?: StringFilter<"OTPChallenge"> | string
    attemptsCount?: IntFilter<"OTPChallenge"> | number
    requestedAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"OTPChallenge"> | Date | string | null
    expiresAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    metadata?: JsonNullableFilter<"OTPChallenge">
    createdAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    customerProfileId?: StringNullableFilter<"OTPChallenge"> | string | null
    customer?: XOR<CustomerProfileNullableScalarRelationFilter, CustomerProfileWhereInput> | null
  }

  export type OTPChallengeOrderByWithRelationInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    provider?: SortOrder
    providerSid?: SortOrderInput | SortOrder
    status?: SortOrder
    attemptsCount?: SortOrder
    requestedAt?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    customerProfileId?: SortOrderInput | SortOrder
    customer?: CustomerProfileOrderByWithRelationInput
  }

  export type OTPChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OTPChallengeWhereInput | OTPChallengeWhereInput[]
    OR?: OTPChallengeWhereInput[]
    NOT?: OTPChallengeWhereInput | OTPChallengeWhereInput[]
    phoneE164?: StringFilter<"OTPChallenge"> | string
    provider?: StringFilter<"OTPChallenge"> | string
    providerSid?: StringNullableFilter<"OTPChallenge"> | string | null
    status?: StringFilter<"OTPChallenge"> | string
    attemptsCount?: IntFilter<"OTPChallenge"> | number
    requestedAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"OTPChallenge"> | Date | string | null
    expiresAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    metadata?: JsonNullableFilter<"OTPChallenge">
    createdAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    customerProfileId?: StringNullableFilter<"OTPChallenge"> | string | null
    customer?: XOR<CustomerProfileNullableScalarRelationFilter, CustomerProfileWhereInput> | null
  }, "id">

  export type OTPChallengeOrderByWithAggregationInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    provider?: SortOrder
    providerSid?: SortOrderInput | SortOrder
    status?: SortOrder
    attemptsCount?: SortOrder
    requestedAt?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    customerProfileId?: SortOrderInput | SortOrder
    _count?: OTPChallengeCountOrderByAggregateInput
    _avg?: OTPChallengeAvgOrderByAggregateInput
    _max?: OTPChallengeMaxOrderByAggregateInput
    _min?: OTPChallengeMinOrderByAggregateInput
    _sum?: OTPChallengeSumOrderByAggregateInput
  }

  export type OTPChallengeScalarWhereWithAggregatesInput = {
    AND?: OTPChallengeScalarWhereWithAggregatesInput | OTPChallengeScalarWhereWithAggregatesInput[]
    OR?: OTPChallengeScalarWhereWithAggregatesInput[]
    NOT?: OTPChallengeScalarWhereWithAggregatesInput | OTPChallengeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OTPChallenge"> | string
    phoneE164?: StringWithAggregatesFilter<"OTPChallenge"> | string
    provider?: StringWithAggregatesFilter<"OTPChallenge"> | string
    providerSid?: StringNullableWithAggregatesFilter<"OTPChallenge"> | string | null
    status?: StringWithAggregatesFilter<"OTPChallenge"> | string
    attemptsCount?: IntWithAggregatesFilter<"OTPChallenge"> | number
    requestedAt?: DateTimeWithAggregatesFilter<"OTPChallenge"> | Date | string
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"OTPChallenge"> | Date | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"OTPChallenge"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"OTPChallenge">
    createdAt?: DateTimeWithAggregatesFilter<"OTPChallenge"> | Date | string
    customerProfileId?: StringNullableWithAggregatesFilter<"OTPChallenge"> | string | null
  }

  export type AuditEventWhereInput = {
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    actorType?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    eventType?: StringFilter<"AuditEvent"> | string
    entityType?: StringFilter<"AuditEvent"> | string
    entityId?: StringNullableFilter<"AuditEvent"> | string | null
    payload?: JsonNullableFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }

  export type AuditEventOrderByWithRelationInput = {
    id?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    actorType?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    eventType?: StringFilter<"AuditEvent"> | string
    entityType?: StringFilter<"AuditEvent"> | string
    entityId?: StringNullableFilter<"AuditEvent"> | string | null
    payload?: JsonNullableFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }, "id">

  export type AuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditEventCountOrderByAggregateInput
    _max?: AuditEventMaxOrderByAggregateInput
    _min?: AuditEventMinOrderByAggregateInput
  }

  export type AuditEventScalarWhereWithAggregatesInput = {
    AND?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    OR?: AuditEventScalarWhereWithAggregatesInput[]
    NOT?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditEvent"> | string
    actorType?: StringWithAggregatesFilter<"AuditEvent"> | string
    actorId?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    eventType?: StringWithAggregatesFilter<"AuditEvent"> | string
    entityType?: StringWithAggregatesFilter<"AuditEvent"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    payload?: JsonNullableWithAggregatesFilter<"AuditEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
  }

  export type OrderActionRequestWhereInput = {
    AND?: OrderActionRequestWhereInput | OrderActionRequestWhereInput[]
    OR?: OrderActionRequestWhereInput[]
    NOT?: OrderActionRequestWhereInput | OrderActionRequestWhereInput[]
    id?: StringFilter<"OrderActionRequest"> | string
    requestType?: EnumRequestTypeFilter<"OrderActionRequest"> | $Enums.RequestType
    customerProfileId?: StringFilter<"OrderActionRequest"> | string
    shopifyCustomerId?: StringNullableFilter<"OrderActionRequest"> | string | null
    shopifyOrderId?: StringNullableFilter<"OrderActionRequest"> | string | null
    orderNumber?: StringFilter<"OrderActionRequest"> | string
    status?: EnumExchangeRequestStatusFilter<"OrderActionRequest"> | $Enums.ExchangeRequestStatus
    reason?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerNote?: StringNullableFilter<"OrderActionRequest"> | string | null
    adminNote?: StringNullableFilter<"OrderActionRequest"> | string | null
    requestedAt?: DateTimeFilter<"OrderActionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"OrderActionRequest"> | Date | string
    customerNameSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerPhoneSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerEmailSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    orderAmountSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    deliveryDateSnapshot?: DateTimeNullableFilter<"OrderActionRequest"> | Date | string | null
    eligibilityDecision?: StringNullableFilter<"OrderActionRequest"> | string | null
    eligibilityReason?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerProfile?: XOR<CustomerProfileScalarRelationFilter, CustomerProfileWhereInput>
    items?: OrderActionItemListRelationFilter
    payments?: RequestPaymentListRelationFilter
    shipments?: ShipmentTrackingListRelationFilter
  }

  export type OrderActionRequestOrderByWithRelationInput = {
    id?: SortOrder
    requestType?: SortOrder
    customerProfileId?: SortOrder
    shopifyCustomerId?: SortOrderInput | SortOrder
    shopifyOrderId?: SortOrderInput | SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    customerNote?: SortOrderInput | SortOrder
    adminNote?: SortOrderInput | SortOrder
    requestedAt?: SortOrder
    updatedAt?: SortOrder
    customerNameSnapshot?: SortOrderInput | SortOrder
    customerPhoneSnapshot?: SortOrderInput | SortOrder
    customerEmailSnapshot?: SortOrderInput | SortOrder
    orderAmountSnapshot?: SortOrderInput | SortOrder
    deliveryDateSnapshot?: SortOrderInput | SortOrder
    eligibilityDecision?: SortOrderInput | SortOrder
    eligibilityReason?: SortOrderInput | SortOrder
    customerProfile?: CustomerProfileOrderByWithRelationInput
    items?: OrderActionItemOrderByRelationAggregateInput
    payments?: RequestPaymentOrderByRelationAggregateInput
    shipments?: ShipmentTrackingOrderByRelationAggregateInput
  }

  export type OrderActionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderActionRequestWhereInput | OrderActionRequestWhereInput[]
    OR?: OrderActionRequestWhereInput[]
    NOT?: OrderActionRequestWhereInput | OrderActionRequestWhereInput[]
    requestType?: EnumRequestTypeFilter<"OrderActionRequest"> | $Enums.RequestType
    customerProfileId?: StringFilter<"OrderActionRequest"> | string
    shopifyCustomerId?: StringNullableFilter<"OrderActionRequest"> | string | null
    shopifyOrderId?: StringNullableFilter<"OrderActionRequest"> | string | null
    orderNumber?: StringFilter<"OrderActionRequest"> | string
    status?: EnumExchangeRequestStatusFilter<"OrderActionRequest"> | $Enums.ExchangeRequestStatus
    reason?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerNote?: StringNullableFilter<"OrderActionRequest"> | string | null
    adminNote?: StringNullableFilter<"OrderActionRequest"> | string | null
    requestedAt?: DateTimeFilter<"OrderActionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"OrderActionRequest"> | Date | string
    customerNameSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerPhoneSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerEmailSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    orderAmountSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    deliveryDateSnapshot?: DateTimeNullableFilter<"OrderActionRequest"> | Date | string | null
    eligibilityDecision?: StringNullableFilter<"OrderActionRequest"> | string | null
    eligibilityReason?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerProfile?: XOR<CustomerProfileScalarRelationFilter, CustomerProfileWhereInput>
    items?: OrderActionItemListRelationFilter
    payments?: RequestPaymentListRelationFilter
    shipments?: ShipmentTrackingListRelationFilter
  }, "id">

  export type OrderActionRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requestType?: SortOrder
    customerProfileId?: SortOrder
    shopifyCustomerId?: SortOrderInput | SortOrder
    shopifyOrderId?: SortOrderInput | SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    customerNote?: SortOrderInput | SortOrder
    adminNote?: SortOrderInput | SortOrder
    requestedAt?: SortOrder
    updatedAt?: SortOrder
    customerNameSnapshot?: SortOrderInput | SortOrder
    customerPhoneSnapshot?: SortOrderInput | SortOrder
    customerEmailSnapshot?: SortOrderInput | SortOrder
    orderAmountSnapshot?: SortOrderInput | SortOrder
    deliveryDateSnapshot?: SortOrderInput | SortOrder
    eligibilityDecision?: SortOrderInput | SortOrder
    eligibilityReason?: SortOrderInput | SortOrder
    _count?: OrderActionRequestCountOrderByAggregateInput
    _max?: OrderActionRequestMaxOrderByAggregateInput
    _min?: OrderActionRequestMinOrderByAggregateInput
  }

  export type OrderActionRequestScalarWhereWithAggregatesInput = {
    AND?: OrderActionRequestScalarWhereWithAggregatesInput | OrderActionRequestScalarWhereWithAggregatesInput[]
    OR?: OrderActionRequestScalarWhereWithAggregatesInput[]
    NOT?: OrderActionRequestScalarWhereWithAggregatesInput | OrderActionRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderActionRequest"> | string
    requestType?: EnumRequestTypeWithAggregatesFilter<"OrderActionRequest"> | $Enums.RequestType
    customerProfileId?: StringWithAggregatesFilter<"OrderActionRequest"> | string
    shopifyCustomerId?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    shopifyOrderId?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    orderNumber?: StringWithAggregatesFilter<"OrderActionRequest"> | string
    status?: EnumExchangeRequestStatusWithAggregatesFilter<"OrderActionRequest"> | $Enums.ExchangeRequestStatus
    reason?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    customerNote?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    adminNote?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    requestedAt?: DateTimeWithAggregatesFilter<"OrderActionRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrderActionRequest"> | Date | string
    customerNameSnapshot?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    customerPhoneSnapshot?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    customerEmailSnapshot?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    orderAmountSnapshot?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    deliveryDateSnapshot?: DateTimeNullableWithAggregatesFilter<"OrderActionRequest"> | Date | string | null
    eligibilityDecision?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
    eligibilityReason?: StringNullableWithAggregatesFilter<"OrderActionRequest"> | string | null
  }

  export type OrderActionItemWhereInput = {
    AND?: OrderActionItemWhereInput | OrderActionItemWhereInput[]
    OR?: OrderActionItemWhereInput[]
    NOT?: OrderActionItemWhereInput | OrderActionItemWhereInput[]
    id?: StringFilter<"OrderActionItem"> | string
    requestId?: StringFilter<"OrderActionItem"> | string
    shopifyLineItemId?: StringNullableFilter<"OrderActionItem"> | string | null
    productTitle?: StringFilter<"OrderActionItem"> | string
    variantTitle?: StringNullableFilter<"OrderActionItem"> | string | null
    sku?: StringNullableFilter<"OrderActionItem"> | string | null
    currentSize?: StringNullableFilter<"OrderActionItem"> | string | null
    requestedSize?: StringFilter<"OrderActionItem"> | string
    quantity?: IntFilter<"OrderActionItem"> | number
    isClearance?: BoolFilter<"OrderActionItem"> | boolean
    isExcludedCategory?: BoolFilter<"OrderActionItem"> | boolean
    eligibilitySnapshot?: JsonNullableFilter<"OrderActionItem">
    createdAt?: DateTimeFilter<"OrderActionItem"> | Date | string
    request?: XOR<OrderActionRequestScalarRelationFilter, OrderActionRequestWhereInput>
  }

  export type OrderActionItemOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    shopifyLineItemId?: SortOrderInput | SortOrder
    productTitle?: SortOrder
    variantTitle?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    currentSize?: SortOrderInput | SortOrder
    requestedSize?: SortOrder
    quantity?: SortOrder
    isClearance?: SortOrder
    isExcludedCategory?: SortOrder
    eligibilitySnapshot?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    request?: OrderActionRequestOrderByWithRelationInput
  }

  export type OrderActionItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderActionItemWhereInput | OrderActionItemWhereInput[]
    OR?: OrderActionItemWhereInput[]
    NOT?: OrderActionItemWhereInput | OrderActionItemWhereInput[]
    requestId?: StringFilter<"OrderActionItem"> | string
    shopifyLineItemId?: StringNullableFilter<"OrderActionItem"> | string | null
    productTitle?: StringFilter<"OrderActionItem"> | string
    variantTitle?: StringNullableFilter<"OrderActionItem"> | string | null
    sku?: StringNullableFilter<"OrderActionItem"> | string | null
    currentSize?: StringNullableFilter<"OrderActionItem"> | string | null
    requestedSize?: StringFilter<"OrderActionItem"> | string
    quantity?: IntFilter<"OrderActionItem"> | number
    isClearance?: BoolFilter<"OrderActionItem"> | boolean
    isExcludedCategory?: BoolFilter<"OrderActionItem"> | boolean
    eligibilitySnapshot?: JsonNullableFilter<"OrderActionItem">
    createdAt?: DateTimeFilter<"OrderActionItem"> | Date | string
    request?: XOR<OrderActionRequestScalarRelationFilter, OrderActionRequestWhereInput>
  }, "id">

  export type OrderActionItemOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    shopifyLineItemId?: SortOrderInput | SortOrder
    productTitle?: SortOrder
    variantTitle?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    currentSize?: SortOrderInput | SortOrder
    requestedSize?: SortOrder
    quantity?: SortOrder
    isClearance?: SortOrder
    isExcludedCategory?: SortOrder
    eligibilitySnapshot?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: OrderActionItemCountOrderByAggregateInput
    _avg?: OrderActionItemAvgOrderByAggregateInput
    _max?: OrderActionItemMaxOrderByAggregateInput
    _min?: OrderActionItemMinOrderByAggregateInput
    _sum?: OrderActionItemSumOrderByAggregateInput
  }

  export type OrderActionItemScalarWhereWithAggregatesInput = {
    AND?: OrderActionItemScalarWhereWithAggregatesInput | OrderActionItemScalarWhereWithAggregatesInput[]
    OR?: OrderActionItemScalarWhereWithAggregatesInput[]
    NOT?: OrderActionItemScalarWhereWithAggregatesInput | OrderActionItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderActionItem"> | string
    requestId?: StringWithAggregatesFilter<"OrderActionItem"> | string
    shopifyLineItemId?: StringNullableWithAggregatesFilter<"OrderActionItem"> | string | null
    productTitle?: StringWithAggregatesFilter<"OrderActionItem"> | string
    variantTitle?: StringNullableWithAggregatesFilter<"OrderActionItem"> | string | null
    sku?: StringNullableWithAggregatesFilter<"OrderActionItem"> | string | null
    currentSize?: StringNullableWithAggregatesFilter<"OrderActionItem"> | string | null
    requestedSize?: StringWithAggregatesFilter<"OrderActionItem"> | string
    quantity?: IntWithAggregatesFilter<"OrderActionItem"> | number
    isClearance?: BoolWithAggregatesFilter<"OrderActionItem"> | boolean
    isExcludedCategory?: BoolWithAggregatesFilter<"OrderActionItem"> | boolean
    eligibilitySnapshot?: JsonNullableWithAggregatesFilter<"OrderActionItem">
    createdAt?: DateTimeWithAggregatesFilter<"OrderActionItem"> | Date | string
  }

  export type RequestPaymentWhereInput = {
    AND?: RequestPaymentWhereInput | RequestPaymentWhereInput[]
    OR?: RequestPaymentWhereInput[]
    NOT?: RequestPaymentWhereInput | RequestPaymentWhereInput[]
    id?: StringFilter<"RequestPayment"> | string
    requestId?: StringFilter<"RequestPayment"> | string
    purpose?: EnumPaymentPurposeFilter<"RequestPayment"> | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFilter<"RequestPayment"> | $Enums.PaymentProvider
    amount?: IntFilter<"RequestPayment"> | number
    currency?: StringFilter<"RequestPayment"> | string
    status?: EnumPaymentStatusFilter<"RequestPayment"> | $Enums.PaymentStatus
    paymentLinkId?: StringNullableFilter<"RequestPayment"> | string | null
    paymentLinkUrl?: StringNullableFilter<"RequestPayment"> | string | null
    providerReferenceId?: StringNullableFilter<"RequestPayment"> | string | null
    paymentId?: StringNullableFilter<"RequestPayment"> | string | null
    paidAt?: DateTimeNullableFilter<"RequestPayment"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"RequestPayment"> | Date | string | null
    createdAt?: DateTimeFilter<"RequestPayment"> | Date | string
    updatedAt?: DateTimeFilter<"RequestPayment"> | Date | string
    request?: XOR<OrderActionRequestScalarRelationFilter, OrderActionRequestWhereInput>
  }

  export type RequestPaymentOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    purpose?: SortOrder
    provider?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paymentLinkId?: SortOrderInput | SortOrder
    paymentLinkUrl?: SortOrderInput | SortOrder
    providerReferenceId?: SortOrderInput | SortOrder
    paymentId?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    request?: OrderActionRequestOrderByWithRelationInput
  }

  export type RequestPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RequestPaymentWhereInput | RequestPaymentWhereInput[]
    OR?: RequestPaymentWhereInput[]
    NOT?: RequestPaymentWhereInput | RequestPaymentWhereInput[]
    requestId?: StringFilter<"RequestPayment"> | string
    purpose?: EnumPaymentPurposeFilter<"RequestPayment"> | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFilter<"RequestPayment"> | $Enums.PaymentProvider
    amount?: IntFilter<"RequestPayment"> | number
    currency?: StringFilter<"RequestPayment"> | string
    status?: EnumPaymentStatusFilter<"RequestPayment"> | $Enums.PaymentStatus
    paymentLinkId?: StringNullableFilter<"RequestPayment"> | string | null
    paymentLinkUrl?: StringNullableFilter<"RequestPayment"> | string | null
    providerReferenceId?: StringNullableFilter<"RequestPayment"> | string | null
    paymentId?: StringNullableFilter<"RequestPayment"> | string | null
    paidAt?: DateTimeNullableFilter<"RequestPayment"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"RequestPayment"> | Date | string | null
    createdAt?: DateTimeFilter<"RequestPayment"> | Date | string
    updatedAt?: DateTimeFilter<"RequestPayment"> | Date | string
    request?: XOR<OrderActionRequestScalarRelationFilter, OrderActionRequestWhereInput>
  }, "id">

  export type RequestPaymentOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    purpose?: SortOrder
    provider?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paymentLinkId?: SortOrderInput | SortOrder
    paymentLinkUrl?: SortOrderInput | SortOrder
    providerReferenceId?: SortOrderInput | SortOrder
    paymentId?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RequestPaymentCountOrderByAggregateInput
    _avg?: RequestPaymentAvgOrderByAggregateInput
    _max?: RequestPaymentMaxOrderByAggregateInput
    _min?: RequestPaymentMinOrderByAggregateInput
    _sum?: RequestPaymentSumOrderByAggregateInput
  }

  export type RequestPaymentScalarWhereWithAggregatesInput = {
    AND?: RequestPaymentScalarWhereWithAggregatesInput | RequestPaymentScalarWhereWithAggregatesInput[]
    OR?: RequestPaymentScalarWhereWithAggregatesInput[]
    NOT?: RequestPaymentScalarWhereWithAggregatesInput | RequestPaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RequestPayment"> | string
    requestId?: StringWithAggregatesFilter<"RequestPayment"> | string
    purpose?: EnumPaymentPurposeWithAggregatesFilter<"RequestPayment"> | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderWithAggregatesFilter<"RequestPayment"> | $Enums.PaymentProvider
    amount?: IntWithAggregatesFilter<"RequestPayment"> | number
    currency?: StringWithAggregatesFilter<"RequestPayment"> | string
    status?: EnumPaymentStatusWithAggregatesFilter<"RequestPayment"> | $Enums.PaymentStatus
    paymentLinkId?: StringNullableWithAggregatesFilter<"RequestPayment"> | string | null
    paymentLinkUrl?: StringNullableWithAggregatesFilter<"RequestPayment"> | string | null
    providerReferenceId?: StringNullableWithAggregatesFilter<"RequestPayment"> | string | null
    paymentId?: StringNullableWithAggregatesFilter<"RequestPayment"> | string | null
    paidAt?: DateTimeNullableWithAggregatesFilter<"RequestPayment"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"RequestPayment"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RequestPayment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RequestPayment"> | Date | string
  }

  export type ShipmentTrackingWhereInput = {
    AND?: ShipmentTrackingWhereInput | ShipmentTrackingWhereInput[]
    OR?: ShipmentTrackingWhereInput[]
    NOT?: ShipmentTrackingWhereInput | ShipmentTrackingWhereInput[]
    id?: StringFilter<"ShipmentTracking"> | string
    requestId?: StringFilter<"ShipmentTracking"> | string
    direction?: EnumShipmentDirectionFilter<"ShipmentTracking"> | $Enums.ShipmentDirection
    carrier?: StringNullableFilter<"ShipmentTracking"> | string | null
    awb?: StringNullableFilter<"ShipmentTracking"> | string | null
    trackingUrl?: StringNullableFilter<"ShipmentTracking"> | string | null
    status?: EnumShipmentStatusFilter<"ShipmentTracking"> | $Enums.ShipmentStatus
    createdAt?: DateTimeFilter<"ShipmentTracking"> | Date | string
    updatedAt?: DateTimeFilter<"ShipmentTracking"> | Date | string
    request?: XOR<OrderActionRequestScalarRelationFilter, OrderActionRequestWhereInput>
  }

  export type ShipmentTrackingOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    direction?: SortOrder
    carrier?: SortOrderInput | SortOrder
    awb?: SortOrderInput | SortOrder
    trackingUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    request?: OrderActionRequestOrderByWithRelationInput
  }

  export type ShipmentTrackingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    requestId_direction?: ShipmentTrackingRequestIdDirectionCompoundUniqueInput
    AND?: ShipmentTrackingWhereInput | ShipmentTrackingWhereInput[]
    OR?: ShipmentTrackingWhereInput[]
    NOT?: ShipmentTrackingWhereInput | ShipmentTrackingWhereInput[]
    requestId?: StringFilter<"ShipmentTracking"> | string
    direction?: EnumShipmentDirectionFilter<"ShipmentTracking"> | $Enums.ShipmentDirection
    carrier?: StringNullableFilter<"ShipmentTracking"> | string | null
    awb?: StringNullableFilter<"ShipmentTracking"> | string | null
    trackingUrl?: StringNullableFilter<"ShipmentTracking"> | string | null
    status?: EnumShipmentStatusFilter<"ShipmentTracking"> | $Enums.ShipmentStatus
    createdAt?: DateTimeFilter<"ShipmentTracking"> | Date | string
    updatedAt?: DateTimeFilter<"ShipmentTracking"> | Date | string
    request?: XOR<OrderActionRequestScalarRelationFilter, OrderActionRequestWhereInput>
  }, "id" | "requestId_direction">

  export type ShipmentTrackingOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    direction?: SortOrder
    carrier?: SortOrderInput | SortOrder
    awb?: SortOrderInput | SortOrder
    trackingUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ShipmentTrackingCountOrderByAggregateInput
    _max?: ShipmentTrackingMaxOrderByAggregateInput
    _min?: ShipmentTrackingMinOrderByAggregateInput
  }

  export type ShipmentTrackingScalarWhereWithAggregatesInput = {
    AND?: ShipmentTrackingScalarWhereWithAggregatesInput | ShipmentTrackingScalarWhereWithAggregatesInput[]
    OR?: ShipmentTrackingScalarWhereWithAggregatesInput[]
    NOT?: ShipmentTrackingScalarWhereWithAggregatesInput | ShipmentTrackingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShipmentTracking"> | string
    requestId?: StringWithAggregatesFilter<"ShipmentTracking"> | string
    direction?: EnumShipmentDirectionWithAggregatesFilter<"ShipmentTracking"> | $Enums.ShipmentDirection
    carrier?: StringNullableWithAggregatesFilter<"ShipmentTracking"> | string | null
    awb?: StringNullableWithAggregatesFilter<"ShipmentTracking"> | string | null
    trackingUrl?: StringNullableWithAggregatesFilter<"ShipmentTracking"> | string | null
    status?: EnumShipmentStatusWithAggregatesFilter<"ShipmentTracking"> | $Enums.ShipmentStatus
    createdAt?: DateTimeWithAggregatesFilter<"ShipmentTracking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ShipmentTracking"> | Date | string
  }

  export type CustomerProfileCreateInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionCreateNestedManyWithoutCustomerInput
    otpChallenges?: OTPChallengeCreateNestedManyWithoutCustomerInput
    orderActionRequests?: OrderActionRequestCreateNestedManyWithoutCustomerProfileInput
  }

  export type CustomerProfileUncheckedCreateInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutCustomerInput
    otpChallenges?: OTPChallengeUncheckedCreateNestedManyWithoutCustomerInput
    orderActionRequests?: OrderActionRequestUncheckedCreateNestedManyWithoutCustomerProfileInput
  }

  export type CustomerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUpdateManyWithoutCustomerNestedInput
    otpChallenges?: OTPChallengeUpdateManyWithoutCustomerNestedInput
    orderActionRequests?: OrderActionRequestUpdateManyWithoutCustomerProfileNestedInput
  }

  export type CustomerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutCustomerNestedInput
    otpChallenges?: OTPChallengeUncheckedUpdateManyWithoutCustomerNestedInput
    orderActionRequests?: OrderActionRequestUncheckedUpdateManyWithoutCustomerProfileNestedInput
  }

  export type CustomerProfileCreateManyInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateInput = {
    id?: string
    sessionTokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerProfileCreateNestedOneWithoutSessionsInput
  }

  export type AuthSessionUncheckedCreateInput = {
    id?: string
    customerProfileId: string
    sessionTokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerProfileUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type AuthSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerProfileId?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateManyInput = {
    id?: string
    customerProfileId: string
    sessionTokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerProfileId?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPChallengeCreateInput = {
    id?: string
    phoneE164: string
    provider: string
    providerSid?: string | null
    status: string
    attemptsCount?: number
    requestedAt?: Date | string
    verifiedAt?: Date | string | null
    expiresAt: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    customer?: CustomerProfileCreateNestedOneWithoutOtpChallengesInput
  }

  export type OTPChallengeUncheckedCreateInput = {
    id?: string
    phoneE164: string
    provider: string
    providerSid?: string | null
    status: string
    attemptsCount?: number
    requestedAt?: Date | string
    verifiedAt?: Date | string | null
    expiresAt: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    customerProfileId?: string | null
  }

  export type OTPChallengeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerProfileUpdateOneWithoutOtpChallengesNestedInput
  }

  export type OTPChallengeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerProfileId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OTPChallengeCreateManyInput = {
    id?: string
    phoneE164: string
    provider: string
    providerSid?: string | null
    status: string
    attemptsCount?: number
    requestedAt?: Date | string
    verifiedAt?: Date | string | null
    expiresAt: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    customerProfileId?: string | null
  }

  export type OTPChallengeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPChallengeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerProfileId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditEventCreateInput = {
    id?: string
    actorType: string
    actorId?: string | null
    eventType: string
    entityType: string
    entityId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventUncheckedCreateInput = {
    id?: string
    actorType: string
    actorId?: string | null
    eventType: string
    entityType: string
    entityId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateManyInput = {
    id?: string
    actorType: string
    actorId?: string | null
    eventType: string
    entityType: string
    entityId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorType?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderActionRequestCreateInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    customerProfile: CustomerProfileCreateNestedOneWithoutOrderActionRequestsInput
    items?: OrderActionItemCreateNestedManyWithoutRequestInput
    payments?: RequestPaymentCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestUncheckedCreateInput = {
    id?: string
    requestType?: $Enums.RequestType
    customerProfileId: string
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    items?: OrderActionItemUncheckedCreateNestedManyWithoutRequestInput
    payments?: RequestPaymentUncheckedCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    customerProfile?: CustomerProfileUpdateOneRequiredWithoutOrderActionRequestsNestedInput
    items?: OrderActionItemUpdateManyWithoutRequestNestedInput
    payments?: RequestPaymentUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    customerProfileId?: StringFieldUpdateOperationsInput | string
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    items?: OrderActionItemUncheckedUpdateManyWithoutRequestNestedInput
    payments?: RequestPaymentUncheckedUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestCreateManyInput = {
    id?: string
    requestType?: $Enums.RequestType
    customerProfileId: string
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
  }

  export type OrderActionRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderActionRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    customerProfileId?: StringFieldUpdateOperationsInput | string
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderActionItemCreateInput = {
    id?: string
    shopifyLineItemId?: string | null
    productTitle: string
    variantTitle?: string | null
    sku?: string | null
    currentSize?: string | null
    requestedSize: string
    quantity?: number
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    request: OrderActionRequestCreateNestedOneWithoutItemsInput
  }

  export type OrderActionItemUncheckedCreateInput = {
    id?: string
    requestId: string
    shopifyLineItemId?: string | null
    productTitle: string
    variantTitle?: string | null
    sku?: string | null
    currentSize?: string | null
    requestedSize: string
    quantity?: number
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrderActionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: OrderActionRequestUpdateOneRequiredWithoutItemsNestedInput
  }

  export type OrderActionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderActionItemCreateManyInput = {
    id?: string
    requestId: string
    shopifyLineItemId?: string | null
    productTitle: string
    variantTitle?: string | null
    sku?: string | null
    currentSize?: string | null
    requestedSize: string
    quantity?: number
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrderActionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderActionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestPaymentCreateInput = {
    id?: string
    purpose?: $Enums.PaymentPurpose
    provider?: $Enums.PaymentProvider
    amount: number
    currency?: string
    status?: $Enums.PaymentStatus
    paymentLinkId?: string | null
    paymentLinkUrl?: string | null
    providerReferenceId?: string | null
    paymentId?: string | null
    paidAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    request: OrderActionRequestCreateNestedOneWithoutPaymentsInput
  }

  export type RequestPaymentUncheckedCreateInput = {
    id?: string
    requestId: string
    purpose?: $Enums.PaymentPurpose
    provider?: $Enums.PaymentProvider
    amount: number
    currency?: string
    status?: $Enums.PaymentStatus
    paymentLinkId?: string | null
    paymentLinkUrl?: string | null
    providerReferenceId?: string | null
    paymentId?: string | null
    paidAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestPaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: OrderActionRequestUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type RequestPaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestPaymentCreateManyInput = {
    id?: string
    requestId: string
    purpose?: $Enums.PaymentPurpose
    provider?: $Enums.PaymentProvider
    amount: number
    currency?: string
    status?: $Enums.PaymentStatus
    paymentLinkId?: string | null
    paymentLinkUrl?: string | null
    providerReferenceId?: string | null
    paymentId?: string | null
    paidAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestPaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestPaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentTrackingCreateInput = {
    id?: string
    direction: $Enums.ShipmentDirection
    carrier?: string | null
    awb?: string | null
    trackingUrl?: string | null
    status?: $Enums.ShipmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    request: OrderActionRequestCreateNestedOneWithoutShipmentsInput
  }

  export type ShipmentTrackingUncheckedCreateInput = {
    id?: string
    requestId: string
    direction: $Enums.ShipmentDirection
    carrier?: string | null
    awb?: string | null
    trackingUrl?: string | null
    status?: $Enums.ShipmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentTrackingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: OrderActionRequestUpdateOneRequiredWithoutShipmentsNestedInput
  }

  export type ShipmentTrackingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentTrackingCreateManyInput = {
    id?: string
    requestId: string
    direction: $Enums.ShipmentDirection
    carrier?: string | null
    awb?: string | null
    trackingUrl?: string | null
    status?: $Enums.ShipmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentTrackingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentTrackingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuthSessionListRelationFilter = {
    every?: AuthSessionWhereInput
    some?: AuthSessionWhereInput
    none?: AuthSessionWhereInput
  }

  export type OTPChallengeListRelationFilter = {
    every?: OTPChallengeWhereInput
    some?: OTPChallengeWhereInput
    none?: OTPChallengeWhereInput
  }

  export type OrderActionRequestListRelationFilter = {
    every?: OrderActionRequestWhereInput
    some?: OrderActionRequestWhereInput
    none?: OrderActionRequestWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuthSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OTPChallengeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderActionRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    stateProvince?: SortOrder
    postalCode?: SortOrder
    countryRegion?: SortOrder
    shopifyCustomerId?: SortOrder
    phoneVerifiedAt?: SortOrder
    profileCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    stateProvince?: SortOrder
    postalCode?: SortOrder
    countryRegion?: SortOrder
    shopifyCustomerId?: SortOrder
    phoneVerifiedAt?: SortOrder
    profileCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    fullName?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    stateProvince?: SortOrder
    postalCode?: SortOrder
    countryRegion?: SortOrder
    shopifyCustomerId?: SortOrder
    phoneVerifiedAt?: SortOrder
    profileCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type CustomerProfileScalarRelationFilter = {
    is?: CustomerProfileWhereInput
    isNot?: CustomerProfileWhereInput
  }

  export type AuthSessionCountOrderByAggregateInput = {
    id?: SortOrder
    customerProfileId?: SortOrder
    sessionTokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    customerProfileId?: SortOrder
    sessionTokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthSessionMinOrderByAggregateInput = {
    id?: SortOrder
    customerProfileId?: SortOrder
    sessionTokenHash?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CustomerProfileNullableScalarRelationFilter = {
    is?: CustomerProfileWhereInput | null
    isNot?: CustomerProfileWhereInput | null
  }

  export type OTPChallengeCountOrderByAggregateInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    provider?: SortOrder
    providerSid?: SortOrder
    status?: SortOrder
    attemptsCount?: SortOrder
    requestedAt?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    customerProfileId?: SortOrder
  }

  export type OTPChallengeAvgOrderByAggregateInput = {
    attemptsCount?: SortOrder
  }

  export type OTPChallengeMaxOrderByAggregateInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    provider?: SortOrder
    providerSid?: SortOrder
    status?: SortOrder
    attemptsCount?: SortOrder
    requestedAt?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    customerProfileId?: SortOrder
  }

  export type OTPChallengeMinOrderByAggregateInput = {
    id?: SortOrder
    phoneE164?: SortOrder
    provider?: SortOrder
    providerSid?: SortOrder
    status?: SortOrder
    attemptsCount?: SortOrder
    requestedAt?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    customerProfileId?: SortOrder
  }

  export type OTPChallengeSumOrderByAggregateInput = {
    attemptsCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    actorType?: SortOrder
    actorId?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumRequestTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestType | EnumRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestTypeFilter<$PrismaModel> | $Enums.RequestType
  }

  export type EnumExchangeRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExchangeRequestStatus | EnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExchangeRequestStatusFilter<$PrismaModel> | $Enums.ExchangeRequestStatus
  }

  export type OrderActionItemListRelationFilter = {
    every?: OrderActionItemWhereInput
    some?: OrderActionItemWhereInput
    none?: OrderActionItemWhereInput
  }

  export type RequestPaymentListRelationFilter = {
    every?: RequestPaymentWhereInput
    some?: RequestPaymentWhereInput
    none?: RequestPaymentWhereInput
  }

  export type ShipmentTrackingListRelationFilter = {
    every?: ShipmentTrackingWhereInput
    some?: ShipmentTrackingWhereInput
    none?: ShipmentTrackingWhereInput
  }

  export type OrderActionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RequestPaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentTrackingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderActionRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requestType?: SortOrder
    customerProfileId?: SortOrder
    shopifyCustomerId?: SortOrder
    shopifyOrderId?: SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    customerNote?: SortOrder
    adminNote?: SortOrder
    requestedAt?: SortOrder
    updatedAt?: SortOrder
    customerNameSnapshot?: SortOrder
    customerPhoneSnapshot?: SortOrder
    customerEmailSnapshot?: SortOrder
    orderAmountSnapshot?: SortOrder
    deliveryDateSnapshot?: SortOrder
    eligibilityDecision?: SortOrder
    eligibilityReason?: SortOrder
  }

  export type OrderActionRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requestType?: SortOrder
    customerProfileId?: SortOrder
    shopifyCustomerId?: SortOrder
    shopifyOrderId?: SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    customerNote?: SortOrder
    adminNote?: SortOrder
    requestedAt?: SortOrder
    updatedAt?: SortOrder
    customerNameSnapshot?: SortOrder
    customerPhoneSnapshot?: SortOrder
    customerEmailSnapshot?: SortOrder
    orderAmountSnapshot?: SortOrder
    deliveryDateSnapshot?: SortOrder
    eligibilityDecision?: SortOrder
    eligibilityReason?: SortOrder
  }

  export type OrderActionRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requestType?: SortOrder
    customerProfileId?: SortOrder
    shopifyCustomerId?: SortOrder
    shopifyOrderId?: SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    customerNote?: SortOrder
    adminNote?: SortOrder
    requestedAt?: SortOrder
    updatedAt?: SortOrder
    customerNameSnapshot?: SortOrder
    customerPhoneSnapshot?: SortOrder
    customerEmailSnapshot?: SortOrder
    orderAmountSnapshot?: SortOrder
    deliveryDateSnapshot?: SortOrder
    eligibilityDecision?: SortOrder
    eligibilityReason?: SortOrder
  }

  export type EnumRequestTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestType | EnumRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestTypeWithAggregatesFilter<$PrismaModel> | $Enums.RequestType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestTypeFilter<$PrismaModel>
    _max?: NestedEnumRequestTypeFilter<$PrismaModel>
  }

  export type EnumExchangeRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExchangeRequestStatus | EnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExchangeRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExchangeRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExchangeRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumExchangeRequestStatusFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type OrderActionRequestScalarRelationFilter = {
    is?: OrderActionRequestWhereInput
    isNot?: OrderActionRequestWhereInput
  }

  export type OrderActionItemCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    shopifyLineItemId?: SortOrder
    productTitle?: SortOrder
    variantTitle?: SortOrder
    sku?: SortOrder
    currentSize?: SortOrder
    requestedSize?: SortOrder
    quantity?: SortOrder
    isClearance?: SortOrder
    isExcludedCategory?: SortOrder
    eligibilitySnapshot?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderActionItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type OrderActionItemMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    shopifyLineItemId?: SortOrder
    productTitle?: SortOrder
    variantTitle?: SortOrder
    sku?: SortOrder
    currentSize?: SortOrder
    requestedSize?: SortOrder
    quantity?: SortOrder
    isClearance?: SortOrder
    isExcludedCategory?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderActionItemMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    shopifyLineItemId?: SortOrder
    productTitle?: SortOrder
    variantTitle?: SortOrder
    sku?: SortOrder
    currentSize?: SortOrder
    requestedSize?: SortOrder
    quantity?: SortOrder
    isClearance?: SortOrder
    isExcludedCategory?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderActionItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumPaymentPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentPurpose | EnumPaymentPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentPurposeFilter<$PrismaModel> | $Enums.PaymentPurpose
  }

  export type EnumPaymentProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderFilter<$PrismaModel> | $Enums.PaymentProvider
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type RequestPaymentCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    purpose?: SortOrder
    provider?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paymentLinkId?: SortOrder
    paymentLinkUrl?: SortOrder
    providerReferenceId?: SortOrder
    paymentId?: SortOrder
    paidAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequestPaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type RequestPaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    purpose?: SortOrder
    provider?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paymentLinkId?: SortOrder
    paymentLinkUrl?: SortOrder
    providerReferenceId?: SortOrder
    paymentId?: SortOrder
    paidAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequestPaymentMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    purpose?: SortOrder
    provider?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    paymentLinkId?: SortOrder
    paymentLinkUrl?: SortOrder
    providerReferenceId?: SortOrder
    paymentId?: SortOrder
    paidAt?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequestPaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumPaymentPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentPurpose | EnumPaymentPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentPurposeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentPurposeFilter<$PrismaModel>
    _max?: NestedEnumPaymentPurposeFilter<$PrismaModel>
  }

  export type EnumPaymentProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type EnumShipmentDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentDirection | EnumShipmentDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentDirectionFilter<$PrismaModel> | $Enums.ShipmentDirection
  }

  export type EnumShipmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusFilter<$PrismaModel> | $Enums.ShipmentStatus
  }

  export type ShipmentTrackingRequestIdDirectionCompoundUniqueInput = {
    requestId: string
    direction: $Enums.ShipmentDirection
  }

  export type ShipmentTrackingCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    direction?: SortOrder
    carrier?: SortOrder
    awb?: SortOrder
    trackingUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShipmentTrackingMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    direction?: SortOrder
    carrier?: SortOrder
    awb?: SortOrder
    trackingUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShipmentTrackingMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    direction?: SortOrder
    carrier?: SortOrder
    awb?: SortOrder
    trackingUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumShipmentDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentDirection | EnumShipmentDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentDirectionWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentDirectionFilter<$PrismaModel>
    _max?: NestedEnumShipmentDirectionFilter<$PrismaModel>
  }

  export type EnumShipmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentStatusFilter<$PrismaModel>
    _max?: NestedEnumShipmentStatusFilter<$PrismaModel>
  }

  export type AuthSessionCreateNestedManyWithoutCustomerInput = {
    create?: XOR<AuthSessionCreateWithoutCustomerInput, AuthSessionUncheckedCreateWithoutCustomerInput> | AuthSessionCreateWithoutCustomerInput[] | AuthSessionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutCustomerInput | AuthSessionCreateOrConnectWithoutCustomerInput[]
    createMany?: AuthSessionCreateManyCustomerInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type OTPChallengeCreateNestedManyWithoutCustomerInput = {
    create?: XOR<OTPChallengeCreateWithoutCustomerInput, OTPChallengeUncheckedCreateWithoutCustomerInput> | OTPChallengeCreateWithoutCustomerInput[] | OTPChallengeUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: OTPChallengeCreateOrConnectWithoutCustomerInput | OTPChallengeCreateOrConnectWithoutCustomerInput[]
    createMany?: OTPChallengeCreateManyCustomerInputEnvelope
    connect?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
  }

  export type OrderActionRequestCreateNestedManyWithoutCustomerProfileInput = {
    create?: XOR<OrderActionRequestCreateWithoutCustomerProfileInput, OrderActionRequestUncheckedCreateWithoutCustomerProfileInput> | OrderActionRequestCreateWithoutCustomerProfileInput[] | OrderActionRequestUncheckedCreateWithoutCustomerProfileInput[]
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutCustomerProfileInput | OrderActionRequestCreateOrConnectWithoutCustomerProfileInput[]
    createMany?: OrderActionRequestCreateManyCustomerProfileInputEnvelope
    connect?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
  }

  export type AuthSessionUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<AuthSessionCreateWithoutCustomerInput, AuthSessionUncheckedCreateWithoutCustomerInput> | AuthSessionCreateWithoutCustomerInput[] | AuthSessionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutCustomerInput | AuthSessionCreateOrConnectWithoutCustomerInput[]
    createMany?: AuthSessionCreateManyCustomerInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type OTPChallengeUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<OTPChallengeCreateWithoutCustomerInput, OTPChallengeUncheckedCreateWithoutCustomerInput> | OTPChallengeCreateWithoutCustomerInput[] | OTPChallengeUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: OTPChallengeCreateOrConnectWithoutCustomerInput | OTPChallengeCreateOrConnectWithoutCustomerInput[]
    createMany?: OTPChallengeCreateManyCustomerInputEnvelope
    connect?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
  }

  export type OrderActionRequestUncheckedCreateNestedManyWithoutCustomerProfileInput = {
    create?: XOR<OrderActionRequestCreateWithoutCustomerProfileInput, OrderActionRequestUncheckedCreateWithoutCustomerProfileInput> | OrderActionRequestCreateWithoutCustomerProfileInput[] | OrderActionRequestUncheckedCreateWithoutCustomerProfileInput[]
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutCustomerProfileInput | OrderActionRequestCreateOrConnectWithoutCustomerProfileInput[]
    createMany?: OrderActionRequestCreateManyCustomerProfileInputEnvelope
    connect?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuthSessionUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<AuthSessionCreateWithoutCustomerInput, AuthSessionUncheckedCreateWithoutCustomerInput> | AuthSessionCreateWithoutCustomerInput[] | AuthSessionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutCustomerInput | AuthSessionCreateOrConnectWithoutCustomerInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutCustomerInput | AuthSessionUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: AuthSessionCreateManyCustomerInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutCustomerInput | AuthSessionUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutCustomerInput | AuthSessionUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type OTPChallengeUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<OTPChallengeCreateWithoutCustomerInput, OTPChallengeUncheckedCreateWithoutCustomerInput> | OTPChallengeCreateWithoutCustomerInput[] | OTPChallengeUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: OTPChallengeCreateOrConnectWithoutCustomerInput | OTPChallengeCreateOrConnectWithoutCustomerInput[]
    upsert?: OTPChallengeUpsertWithWhereUniqueWithoutCustomerInput | OTPChallengeUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: OTPChallengeCreateManyCustomerInputEnvelope
    set?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    disconnect?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    delete?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    connect?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    update?: OTPChallengeUpdateWithWhereUniqueWithoutCustomerInput | OTPChallengeUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: OTPChallengeUpdateManyWithWhereWithoutCustomerInput | OTPChallengeUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: OTPChallengeScalarWhereInput | OTPChallengeScalarWhereInput[]
  }

  export type OrderActionRequestUpdateManyWithoutCustomerProfileNestedInput = {
    create?: XOR<OrderActionRequestCreateWithoutCustomerProfileInput, OrderActionRequestUncheckedCreateWithoutCustomerProfileInput> | OrderActionRequestCreateWithoutCustomerProfileInput[] | OrderActionRequestUncheckedCreateWithoutCustomerProfileInput[]
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutCustomerProfileInput | OrderActionRequestCreateOrConnectWithoutCustomerProfileInput[]
    upsert?: OrderActionRequestUpsertWithWhereUniqueWithoutCustomerProfileInput | OrderActionRequestUpsertWithWhereUniqueWithoutCustomerProfileInput[]
    createMany?: OrderActionRequestCreateManyCustomerProfileInputEnvelope
    set?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    disconnect?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    delete?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    connect?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    update?: OrderActionRequestUpdateWithWhereUniqueWithoutCustomerProfileInput | OrderActionRequestUpdateWithWhereUniqueWithoutCustomerProfileInput[]
    updateMany?: OrderActionRequestUpdateManyWithWhereWithoutCustomerProfileInput | OrderActionRequestUpdateManyWithWhereWithoutCustomerProfileInput[]
    deleteMany?: OrderActionRequestScalarWhereInput | OrderActionRequestScalarWhereInput[]
  }

  export type AuthSessionUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<AuthSessionCreateWithoutCustomerInput, AuthSessionUncheckedCreateWithoutCustomerInput> | AuthSessionCreateWithoutCustomerInput[] | AuthSessionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutCustomerInput | AuthSessionCreateOrConnectWithoutCustomerInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutCustomerInput | AuthSessionUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: AuthSessionCreateManyCustomerInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutCustomerInput | AuthSessionUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutCustomerInput | AuthSessionUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type OTPChallengeUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<OTPChallengeCreateWithoutCustomerInput, OTPChallengeUncheckedCreateWithoutCustomerInput> | OTPChallengeCreateWithoutCustomerInput[] | OTPChallengeUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: OTPChallengeCreateOrConnectWithoutCustomerInput | OTPChallengeCreateOrConnectWithoutCustomerInput[]
    upsert?: OTPChallengeUpsertWithWhereUniqueWithoutCustomerInput | OTPChallengeUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: OTPChallengeCreateManyCustomerInputEnvelope
    set?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    disconnect?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    delete?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    connect?: OTPChallengeWhereUniqueInput | OTPChallengeWhereUniqueInput[]
    update?: OTPChallengeUpdateWithWhereUniqueWithoutCustomerInput | OTPChallengeUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: OTPChallengeUpdateManyWithWhereWithoutCustomerInput | OTPChallengeUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: OTPChallengeScalarWhereInput | OTPChallengeScalarWhereInput[]
  }

  export type OrderActionRequestUncheckedUpdateManyWithoutCustomerProfileNestedInput = {
    create?: XOR<OrderActionRequestCreateWithoutCustomerProfileInput, OrderActionRequestUncheckedCreateWithoutCustomerProfileInput> | OrderActionRequestCreateWithoutCustomerProfileInput[] | OrderActionRequestUncheckedCreateWithoutCustomerProfileInput[]
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutCustomerProfileInput | OrderActionRequestCreateOrConnectWithoutCustomerProfileInput[]
    upsert?: OrderActionRequestUpsertWithWhereUniqueWithoutCustomerProfileInput | OrderActionRequestUpsertWithWhereUniqueWithoutCustomerProfileInput[]
    createMany?: OrderActionRequestCreateManyCustomerProfileInputEnvelope
    set?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    disconnect?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    delete?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    connect?: OrderActionRequestWhereUniqueInput | OrderActionRequestWhereUniqueInput[]
    update?: OrderActionRequestUpdateWithWhereUniqueWithoutCustomerProfileInput | OrderActionRequestUpdateWithWhereUniqueWithoutCustomerProfileInput[]
    updateMany?: OrderActionRequestUpdateManyWithWhereWithoutCustomerProfileInput | OrderActionRequestUpdateManyWithWhereWithoutCustomerProfileInput[]
    deleteMany?: OrderActionRequestScalarWhereInput | OrderActionRequestScalarWhereInput[]
  }

  export type CustomerProfileCreateNestedOneWithoutSessionsInput = {
    create?: XOR<CustomerProfileCreateWithoutSessionsInput, CustomerProfileUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: CustomerProfileCreateOrConnectWithoutSessionsInput
    connect?: CustomerProfileWhereUniqueInput
  }

  export type CustomerProfileUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<CustomerProfileCreateWithoutSessionsInput, CustomerProfileUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: CustomerProfileCreateOrConnectWithoutSessionsInput
    upsert?: CustomerProfileUpsertWithoutSessionsInput
    connect?: CustomerProfileWhereUniqueInput
    update?: XOR<XOR<CustomerProfileUpdateToOneWithWhereWithoutSessionsInput, CustomerProfileUpdateWithoutSessionsInput>, CustomerProfileUncheckedUpdateWithoutSessionsInput>
  }

  export type CustomerProfileCreateNestedOneWithoutOtpChallengesInput = {
    create?: XOR<CustomerProfileCreateWithoutOtpChallengesInput, CustomerProfileUncheckedCreateWithoutOtpChallengesInput>
    connectOrCreate?: CustomerProfileCreateOrConnectWithoutOtpChallengesInput
    connect?: CustomerProfileWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CustomerProfileUpdateOneWithoutOtpChallengesNestedInput = {
    create?: XOR<CustomerProfileCreateWithoutOtpChallengesInput, CustomerProfileUncheckedCreateWithoutOtpChallengesInput>
    connectOrCreate?: CustomerProfileCreateOrConnectWithoutOtpChallengesInput
    upsert?: CustomerProfileUpsertWithoutOtpChallengesInput
    disconnect?: CustomerProfileWhereInput | boolean
    delete?: CustomerProfileWhereInput | boolean
    connect?: CustomerProfileWhereUniqueInput
    update?: XOR<XOR<CustomerProfileUpdateToOneWithWhereWithoutOtpChallengesInput, CustomerProfileUpdateWithoutOtpChallengesInput>, CustomerProfileUncheckedUpdateWithoutOtpChallengesInput>
  }

  export type CustomerProfileCreateNestedOneWithoutOrderActionRequestsInput = {
    create?: XOR<CustomerProfileCreateWithoutOrderActionRequestsInput, CustomerProfileUncheckedCreateWithoutOrderActionRequestsInput>
    connectOrCreate?: CustomerProfileCreateOrConnectWithoutOrderActionRequestsInput
    connect?: CustomerProfileWhereUniqueInput
  }

  export type OrderActionItemCreateNestedManyWithoutRequestInput = {
    create?: XOR<OrderActionItemCreateWithoutRequestInput, OrderActionItemUncheckedCreateWithoutRequestInput> | OrderActionItemCreateWithoutRequestInput[] | OrderActionItemUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: OrderActionItemCreateOrConnectWithoutRequestInput | OrderActionItemCreateOrConnectWithoutRequestInput[]
    createMany?: OrderActionItemCreateManyRequestInputEnvelope
    connect?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
  }

  export type RequestPaymentCreateNestedManyWithoutRequestInput = {
    create?: XOR<RequestPaymentCreateWithoutRequestInput, RequestPaymentUncheckedCreateWithoutRequestInput> | RequestPaymentCreateWithoutRequestInput[] | RequestPaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RequestPaymentCreateOrConnectWithoutRequestInput | RequestPaymentCreateOrConnectWithoutRequestInput[]
    createMany?: RequestPaymentCreateManyRequestInputEnvelope
    connect?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
  }

  export type ShipmentTrackingCreateNestedManyWithoutRequestInput = {
    create?: XOR<ShipmentTrackingCreateWithoutRequestInput, ShipmentTrackingUncheckedCreateWithoutRequestInput> | ShipmentTrackingCreateWithoutRequestInput[] | ShipmentTrackingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: ShipmentTrackingCreateOrConnectWithoutRequestInput | ShipmentTrackingCreateOrConnectWithoutRequestInput[]
    createMany?: ShipmentTrackingCreateManyRequestInputEnvelope
    connect?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
  }

  export type OrderActionItemUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<OrderActionItemCreateWithoutRequestInput, OrderActionItemUncheckedCreateWithoutRequestInput> | OrderActionItemCreateWithoutRequestInput[] | OrderActionItemUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: OrderActionItemCreateOrConnectWithoutRequestInput | OrderActionItemCreateOrConnectWithoutRequestInput[]
    createMany?: OrderActionItemCreateManyRequestInputEnvelope
    connect?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
  }

  export type RequestPaymentUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<RequestPaymentCreateWithoutRequestInput, RequestPaymentUncheckedCreateWithoutRequestInput> | RequestPaymentCreateWithoutRequestInput[] | RequestPaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RequestPaymentCreateOrConnectWithoutRequestInput | RequestPaymentCreateOrConnectWithoutRequestInput[]
    createMany?: RequestPaymentCreateManyRequestInputEnvelope
    connect?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
  }

  export type ShipmentTrackingUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<ShipmentTrackingCreateWithoutRequestInput, ShipmentTrackingUncheckedCreateWithoutRequestInput> | ShipmentTrackingCreateWithoutRequestInput[] | ShipmentTrackingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: ShipmentTrackingCreateOrConnectWithoutRequestInput | ShipmentTrackingCreateOrConnectWithoutRequestInput[]
    createMany?: ShipmentTrackingCreateManyRequestInputEnvelope
    connect?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
  }

  export type EnumRequestTypeFieldUpdateOperationsInput = {
    set?: $Enums.RequestType
  }

  export type EnumExchangeRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExchangeRequestStatus
  }

  export type CustomerProfileUpdateOneRequiredWithoutOrderActionRequestsNestedInput = {
    create?: XOR<CustomerProfileCreateWithoutOrderActionRequestsInput, CustomerProfileUncheckedCreateWithoutOrderActionRequestsInput>
    connectOrCreate?: CustomerProfileCreateOrConnectWithoutOrderActionRequestsInput
    upsert?: CustomerProfileUpsertWithoutOrderActionRequestsInput
    connect?: CustomerProfileWhereUniqueInput
    update?: XOR<XOR<CustomerProfileUpdateToOneWithWhereWithoutOrderActionRequestsInput, CustomerProfileUpdateWithoutOrderActionRequestsInput>, CustomerProfileUncheckedUpdateWithoutOrderActionRequestsInput>
  }

  export type OrderActionItemUpdateManyWithoutRequestNestedInput = {
    create?: XOR<OrderActionItemCreateWithoutRequestInput, OrderActionItemUncheckedCreateWithoutRequestInput> | OrderActionItemCreateWithoutRequestInput[] | OrderActionItemUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: OrderActionItemCreateOrConnectWithoutRequestInput | OrderActionItemCreateOrConnectWithoutRequestInput[]
    upsert?: OrderActionItemUpsertWithWhereUniqueWithoutRequestInput | OrderActionItemUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: OrderActionItemCreateManyRequestInputEnvelope
    set?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    disconnect?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    delete?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    connect?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    update?: OrderActionItemUpdateWithWhereUniqueWithoutRequestInput | OrderActionItemUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: OrderActionItemUpdateManyWithWhereWithoutRequestInput | OrderActionItemUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: OrderActionItemScalarWhereInput | OrderActionItemScalarWhereInput[]
  }

  export type RequestPaymentUpdateManyWithoutRequestNestedInput = {
    create?: XOR<RequestPaymentCreateWithoutRequestInput, RequestPaymentUncheckedCreateWithoutRequestInput> | RequestPaymentCreateWithoutRequestInput[] | RequestPaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RequestPaymentCreateOrConnectWithoutRequestInput | RequestPaymentCreateOrConnectWithoutRequestInput[]
    upsert?: RequestPaymentUpsertWithWhereUniqueWithoutRequestInput | RequestPaymentUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: RequestPaymentCreateManyRequestInputEnvelope
    set?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    disconnect?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    delete?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    connect?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    update?: RequestPaymentUpdateWithWhereUniqueWithoutRequestInput | RequestPaymentUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: RequestPaymentUpdateManyWithWhereWithoutRequestInput | RequestPaymentUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: RequestPaymentScalarWhereInput | RequestPaymentScalarWhereInput[]
  }

  export type ShipmentTrackingUpdateManyWithoutRequestNestedInput = {
    create?: XOR<ShipmentTrackingCreateWithoutRequestInput, ShipmentTrackingUncheckedCreateWithoutRequestInput> | ShipmentTrackingCreateWithoutRequestInput[] | ShipmentTrackingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: ShipmentTrackingCreateOrConnectWithoutRequestInput | ShipmentTrackingCreateOrConnectWithoutRequestInput[]
    upsert?: ShipmentTrackingUpsertWithWhereUniqueWithoutRequestInput | ShipmentTrackingUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: ShipmentTrackingCreateManyRequestInputEnvelope
    set?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    disconnect?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    delete?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    connect?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    update?: ShipmentTrackingUpdateWithWhereUniqueWithoutRequestInput | ShipmentTrackingUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: ShipmentTrackingUpdateManyWithWhereWithoutRequestInput | ShipmentTrackingUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: ShipmentTrackingScalarWhereInput | ShipmentTrackingScalarWhereInput[]
  }

  export type OrderActionItemUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<OrderActionItemCreateWithoutRequestInput, OrderActionItemUncheckedCreateWithoutRequestInput> | OrderActionItemCreateWithoutRequestInput[] | OrderActionItemUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: OrderActionItemCreateOrConnectWithoutRequestInput | OrderActionItemCreateOrConnectWithoutRequestInput[]
    upsert?: OrderActionItemUpsertWithWhereUniqueWithoutRequestInput | OrderActionItemUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: OrderActionItemCreateManyRequestInputEnvelope
    set?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    disconnect?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    delete?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    connect?: OrderActionItemWhereUniqueInput | OrderActionItemWhereUniqueInput[]
    update?: OrderActionItemUpdateWithWhereUniqueWithoutRequestInput | OrderActionItemUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: OrderActionItemUpdateManyWithWhereWithoutRequestInput | OrderActionItemUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: OrderActionItemScalarWhereInput | OrderActionItemScalarWhereInput[]
  }

  export type RequestPaymentUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<RequestPaymentCreateWithoutRequestInput, RequestPaymentUncheckedCreateWithoutRequestInput> | RequestPaymentCreateWithoutRequestInput[] | RequestPaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: RequestPaymentCreateOrConnectWithoutRequestInput | RequestPaymentCreateOrConnectWithoutRequestInput[]
    upsert?: RequestPaymentUpsertWithWhereUniqueWithoutRequestInput | RequestPaymentUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: RequestPaymentCreateManyRequestInputEnvelope
    set?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    disconnect?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    delete?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    connect?: RequestPaymentWhereUniqueInput | RequestPaymentWhereUniqueInput[]
    update?: RequestPaymentUpdateWithWhereUniqueWithoutRequestInput | RequestPaymentUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: RequestPaymentUpdateManyWithWhereWithoutRequestInput | RequestPaymentUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: RequestPaymentScalarWhereInput | RequestPaymentScalarWhereInput[]
  }

  export type ShipmentTrackingUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<ShipmentTrackingCreateWithoutRequestInput, ShipmentTrackingUncheckedCreateWithoutRequestInput> | ShipmentTrackingCreateWithoutRequestInput[] | ShipmentTrackingUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: ShipmentTrackingCreateOrConnectWithoutRequestInput | ShipmentTrackingCreateOrConnectWithoutRequestInput[]
    upsert?: ShipmentTrackingUpsertWithWhereUniqueWithoutRequestInput | ShipmentTrackingUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: ShipmentTrackingCreateManyRequestInputEnvelope
    set?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    disconnect?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    delete?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    connect?: ShipmentTrackingWhereUniqueInput | ShipmentTrackingWhereUniqueInput[]
    update?: ShipmentTrackingUpdateWithWhereUniqueWithoutRequestInput | ShipmentTrackingUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: ShipmentTrackingUpdateManyWithWhereWithoutRequestInput | ShipmentTrackingUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: ShipmentTrackingScalarWhereInput | ShipmentTrackingScalarWhereInput[]
  }

  export type OrderActionRequestCreateNestedOneWithoutItemsInput = {
    create?: XOR<OrderActionRequestCreateWithoutItemsInput, OrderActionRequestUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutItemsInput
    connect?: OrderActionRequestWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type OrderActionRequestUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<OrderActionRequestCreateWithoutItemsInput, OrderActionRequestUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutItemsInput
    upsert?: OrderActionRequestUpsertWithoutItemsInput
    connect?: OrderActionRequestWhereUniqueInput
    update?: XOR<XOR<OrderActionRequestUpdateToOneWithWhereWithoutItemsInput, OrderActionRequestUpdateWithoutItemsInput>, OrderActionRequestUncheckedUpdateWithoutItemsInput>
  }

  export type OrderActionRequestCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<OrderActionRequestCreateWithoutPaymentsInput, OrderActionRequestUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutPaymentsInput
    connect?: OrderActionRequestWhereUniqueInput
  }

  export type EnumPaymentPurposeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentPurpose
  }

  export type EnumPaymentProviderFieldUpdateOperationsInput = {
    set?: $Enums.PaymentProvider
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type OrderActionRequestUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<OrderActionRequestCreateWithoutPaymentsInput, OrderActionRequestUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutPaymentsInput
    upsert?: OrderActionRequestUpsertWithoutPaymentsInput
    connect?: OrderActionRequestWhereUniqueInput
    update?: XOR<XOR<OrderActionRequestUpdateToOneWithWhereWithoutPaymentsInput, OrderActionRequestUpdateWithoutPaymentsInput>, OrderActionRequestUncheckedUpdateWithoutPaymentsInput>
  }

  export type OrderActionRequestCreateNestedOneWithoutShipmentsInput = {
    create?: XOR<OrderActionRequestCreateWithoutShipmentsInput, OrderActionRequestUncheckedCreateWithoutShipmentsInput>
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutShipmentsInput
    connect?: OrderActionRequestWhereUniqueInput
  }

  export type EnumShipmentDirectionFieldUpdateOperationsInput = {
    set?: $Enums.ShipmentDirection
  }

  export type EnumShipmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.ShipmentStatus
  }

  export type OrderActionRequestUpdateOneRequiredWithoutShipmentsNestedInput = {
    create?: XOR<OrderActionRequestCreateWithoutShipmentsInput, OrderActionRequestUncheckedCreateWithoutShipmentsInput>
    connectOrCreate?: OrderActionRequestCreateOrConnectWithoutShipmentsInput
    upsert?: OrderActionRequestUpsertWithoutShipmentsInput
    connect?: OrderActionRequestWhereUniqueInput
    update?: XOR<XOR<OrderActionRequestUpdateToOneWithWhereWithoutShipmentsInput, OrderActionRequestUpdateWithoutShipmentsInput>, OrderActionRequestUncheckedUpdateWithoutShipmentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumRequestTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestType | EnumRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestTypeFilter<$PrismaModel> | $Enums.RequestType
  }

  export type NestedEnumExchangeRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExchangeRequestStatus | EnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExchangeRequestStatusFilter<$PrismaModel> | $Enums.ExchangeRequestStatus
  }

  export type NestedEnumRequestTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestType | EnumRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestType[] | ListEnumRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestTypeWithAggregatesFilter<$PrismaModel> | $Enums.RequestType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestTypeFilter<$PrismaModel>
    _max?: NestedEnumRequestTypeFilter<$PrismaModel>
  }

  export type NestedEnumExchangeRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExchangeRequestStatus | EnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExchangeRequestStatus[] | ListEnumExchangeRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExchangeRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExchangeRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExchangeRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumExchangeRequestStatusFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumPaymentPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentPurpose | EnumPaymentPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentPurposeFilter<$PrismaModel> | $Enums.PaymentPurpose
  }

  export type NestedEnumPaymentProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderFilter<$PrismaModel> | $Enums.PaymentProvider
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentPurpose | EnumPaymentPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentPurpose[] | ListEnumPaymentPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentPurposeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentPurposeFilter<$PrismaModel>
    _max?: NestedEnumPaymentPurposeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumShipmentDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentDirection | EnumShipmentDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentDirectionFilter<$PrismaModel> | $Enums.ShipmentDirection
  }

  export type NestedEnumShipmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusFilter<$PrismaModel> | $Enums.ShipmentStatus
  }

  export type NestedEnumShipmentDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentDirection | EnumShipmentDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentDirection[] | ListEnumShipmentDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentDirectionWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentDirectionFilter<$PrismaModel>
    _max?: NestedEnumShipmentDirectionFilter<$PrismaModel>
  }

  export type NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentStatusFilter<$PrismaModel>
    _max?: NestedEnumShipmentStatusFilter<$PrismaModel>
  }

  export type AuthSessionCreateWithoutCustomerInput = {
    id?: string
    sessionTokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionUncheckedCreateWithoutCustomerInput = {
    id?: string
    sessionTokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionCreateOrConnectWithoutCustomerInput = {
    where: AuthSessionWhereUniqueInput
    create: XOR<AuthSessionCreateWithoutCustomerInput, AuthSessionUncheckedCreateWithoutCustomerInput>
  }

  export type AuthSessionCreateManyCustomerInputEnvelope = {
    data: AuthSessionCreateManyCustomerInput | AuthSessionCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type OTPChallengeCreateWithoutCustomerInput = {
    id?: string
    phoneE164: string
    provider: string
    providerSid?: string | null
    status: string
    attemptsCount?: number
    requestedAt?: Date | string
    verifiedAt?: Date | string | null
    expiresAt: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OTPChallengeUncheckedCreateWithoutCustomerInput = {
    id?: string
    phoneE164: string
    provider: string
    providerSid?: string | null
    status: string
    attemptsCount?: number
    requestedAt?: Date | string
    verifiedAt?: Date | string | null
    expiresAt: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OTPChallengeCreateOrConnectWithoutCustomerInput = {
    where: OTPChallengeWhereUniqueInput
    create: XOR<OTPChallengeCreateWithoutCustomerInput, OTPChallengeUncheckedCreateWithoutCustomerInput>
  }

  export type OTPChallengeCreateManyCustomerInputEnvelope = {
    data: OTPChallengeCreateManyCustomerInput | OTPChallengeCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type OrderActionRequestCreateWithoutCustomerProfileInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    items?: OrderActionItemCreateNestedManyWithoutRequestInput
    payments?: RequestPaymentCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestUncheckedCreateWithoutCustomerProfileInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    items?: OrderActionItemUncheckedCreateNestedManyWithoutRequestInput
    payments?: RequestPaymentUncheckedCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestCreateOrConnectWithoutCustomerProfileInput = {
    where: OrderActionRequestWhereUniqueInput
    create: XOR<OrderActionRequestCreateWithoutCustomerProfileInput, OrderActionRequestUncheckedCreateWithoutCustomerProfileInput>
  }

  export type OrderActionRequestCreateManyCustomerProfileInputEnvelope = {
    data: OrderActionRequestCreateManyCustomerProfileInput | OrderActionRequestCreateManyCustomerProfileInput[]
    skipDuplicates?: boolean
  }

  export type AuthSessionUpsertWithWhereUniqueWithoutCustomerInput = {
    where: AuthSessionWhereUniqueInput
    update: XOR<AuthSessionUpdateWithoutCustomerInput, AuthSessionUncheckedUpdateWithoutCustomerInput>
    create: XOR<AuthSessionCreateWithoutCustomerInput, AuthSessionUncheckedCreateWithoutCustomerInput>
  }

  export type AuthSessionUpdateWithWhereUniqueWithoutCustomerInput = {
    where: AuthSessionWhereUniqueInput
    data: XOR<AuthSessionUpdateWithoutCustomerInput, AuthSessionUncheckedUpdateWithoutCustomerInput>
  }

  export type AuthSessionUpdateManyWithWhereWithoutCustomerInput = {
    where: AuthSessionScalarWhereInput
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyWithoutCustomerInput>
  }

  export type AuthSessionScalarWhereInput = {
    AND?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    OR?: AuthSessionScalarWhereInput[]
    NOT?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    id?: StringFilter<"AuthSession"> | string
    customerProfileId?: StringFilter<"AuthSession"> | string
    sessionTokenHash?: StringFilter<"AuthSession"> | string
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    lastSeenAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuthSession"> | Date | string
  }

  export type OTPChallengeUpsertWithWhereUniqueWithoutCustomerInput = {
    where: OTPChallengeWhereUniqueInput
    update: XOR<OTPChallengeUpdateWithoutCustomerInput, OTPChallengeUncheckedUpdateWithoutCustomerInput>
    create: XOR<OTPChallengeCreateWithoutCustomerInput, OTPChallengeUncheckedCreateWithoutCustomerInput>
  }

  export type OTPChallengeUpdateWithWhereUniqueWithoutCustomerInput = {
    where: OTPChallengeWhereUniqueInput
    data: XOR<OTPChallengeUpdateWithoutCustomerInput, OTPChallengeUncheckedUpdateWithoutCustomerInput>
  }

  export type OTPChallengeUpdateManyWithWhereWithoutCustomerInput = {
    where: OTPChallengeScalarWhereInput
    data: XOR<OTPChallengeUpdateManyMutationInput, OTPChallengeUncheckedUpdateManyWithoutCustomerInput>
  }

  export type OTPChallengeScalarWhereInput = {
    AND?: OTPChallengeScalarWhereInput | OTPChallengeScalarWhereInput[]
    OR?: OTPChallengeScalarWhereInput[]
    NOT?: OTPChallengeScalarWhereInput | OTPChallengeScalarWhereInput[]
    id?: StringFilter<"OTPChallenge"> | string
    phoneE164?: StringFilter<"OTPChallenge"> | string
    provider?: StringFilter<"OTPChallenge"> | string
    providerSid?: StringNullableFilter<"OTPChallenge"> | string | null
    status?: StringFilter<"OTPChallenge"> | string
    attemptsCount?: IntFilter<"OTPChallenge"> | number
    requestedAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"OTPChallenge"> | Date | string | null
    expiresAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    metadata?: JsonNullableFilter<"OTPChallenge">
    createdAt?: DateTimeFilter<"OTPChallenge"> | Date | string
    customerProfileId?: StringNullableFilter<"OTPChallenge"> | string | null
  }

  export type OrderActionRequestUpsertWithWhereUniqueWithoutCustomerProfileInput = {
    where: OrderActionRequestWhereUniqueInput
    update: XOR<OrderActionRequestUpdateWithoutCustomerProfileInput, OrderActionRequestUncheckedUpdateWithoutCustomerProfileInput>
    create: XOR<OrderActionRequestCreateWithoutCustomerProfileInput, OrderActionRequestUncheckedCreateWithoutCustomerProfileInput>
  }

  export type OrderActionRequestUpdateWithWhereUniqueWithoutCustomerProfileInput = {
    where: OrderActionRequestWhereUniqueInput
    data: XOR<OrderActionRequestUpdateWithoutCustomerProfileInput, OrderActionRequestUncheckedUpdateWithoutCustomerProfileInput>
  }

  export type OrderActionRequestUpdateManyWithWhereWithoutCustomerProfileInput = {
    where: OrderActionRequestScalarWhereInput
    data: XOR<OrderActionRequestUpdateManyMutationInput, OrderActionRequestUncheckedUpdateManyWithoutCustomerProfileInput>
  }

  export type OrderActionRequestScalarWhereInput = {
    AND?: OrderActionRequestScalarWhereInput | OrderActionRequestScalarWhereInput[]
    OR?: OrderActionRequestScalarWhereInput[]
    NOT?: OrderActionRequestScalarWhereInput | OrderActionRequestScalarWhereInput[]
    id?: StringFilter<"OrderActionRequest"> | string
    requestType?: EnumRequestTypeFilter<"OrderActionRequest"> | $Enums.RequestType
    customerProfileId?: StringFilter<"OrderActionRequest"> | string
    shopifyCustomerId?: StringNullableFilter<"OrderActionRequest"> | string | null
    shopifyOrderId?: StringNullableFilter<"OrderActionRequest"> | string | null
    orderNumber?: StringFilter<"OrderActionRequest"> | string
    status?: EnumExchangeRequestStatusFilter<"OrderActionRequest"> | $Enums.ExchangeRequestStatus
    reason?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerNote?: StringNullableFilter<"OrderActionRequest"> | string | null
    adminNote?: StringNullableFilter<"OrderActionRequest"> | string | null
    requestedAt?: DateTimeFilter<"OrderActionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"OrderActionRequest"> | Date | string
    customerNameSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerPhoneSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    customerEmailSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    orderAmountSnapshot?: StringNullableFilter<"OrderActionRequest"> | string | null
    deliveryDateSnapshot?: DateTimeNullableFilter<"OrderActionRequest"> | Date | string | null
    eligibilityDecision?: StringNullableFilter<"OrderActionRequest"> | string | null
    eligibilityReason?: StringNullableFilter<"OrderActionRequest"> | string | null
  }

  export type CustomerProfileCreateWithoutSessionsInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    otpChallenges?: OTPChallengeCreateNestedManyWithoutCustomerInput
    orderActionRequests?: OrderActionRequestCreateNestedManyWithoutCustomerProfileInput
  }

  export type CustomerProfileUncheckedCreateWithoutSessionsInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    otpChallenges?: OTPChallengeUncheckedCreateNestedManyWithoutCustomerInput
    orderActionRequests?: OrderActionRequestUncheckedCreateNestedManyWithoutCustomerProfileInput
  }

  export type CustomerProfileCreateOrConnectWithoutSessionsInput = {
    where: CustomerProfileWhereUniqueInput
    create: XOR<CustomerProfileCreateWithoutSessionsInput, CustomerProfileUncheckedCreateWithoutSessionsInput>
  }

  export type CustomerProfileUpsertWithoutSessionsInput = {
    update: XOR<CustomerProfileUpdateWithoutSessionsInput, CustomerProfileUncheckedUpdateWithoutSessionsInput>
    create: XOR<CustomerProfileCreateWithoutSessionsInput, CustomerProfileUncheckedCreateWithoutSessionsInput>
    where?: CustomerProfileWhereInput
  }

  export type CustomerProfileUpdateToOneWithWhereWithoutSessionsInput = {
    where?: CustomerProfileWhereInput
    data: XOR<CustomerProfileUpdateWithoutSessionsInput, CustomerProfileUncheckedUpdateWithoutSessionsInput>
  }

  export type CustomerProfileUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpChallenges?: OTPChallengeUpdateManyWithoutCustomerNestedInput
    orderActionRequests?: OrderActionRequestUpdateManyWithoutCustomerProfileNestedInput
  }

  export type CustomerProfileUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpChallenges?: OTPChallengeUncheckedUpdateManyWithoutCustomerNestedInput
    orderActionRequests?: OrderActionRequestUncheckedUpdateManyWithoutCustomerProfileNestedInput
  }

  export type CustomerProfileCreateWithoutOtpChallengesInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionCreateNestedManyWithoutCustomerInput
    orderActionRequests?: OrderActionRequestCreateNestedManyWithoutCustomerProfileInput
  }

  export type CustomerProfileUncheckedCreateWithoutOtpChallengesInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutCustomerInput
    orderActionRequests?: OrderActionRequestUncheckedCreateNestedManyWithoutCustomerProfileInput
  }

  export type CustomerProfileCreateOrConnectWithoutOtpChallengesInput = {
    where: CustomerProfileWhereUniqueInput
    create: XOR<CustomerProfileCreateWithoutOtpChallengesInput, CustomerProfileUncheckedCreateWithoutOtpChallengesInput>
  }

  export type CustomerProfileUpsertWithoutOtpChallengesInput = {
    update: XOR<CustomerProfileUpdateWithoutOtpChallengesInput, CustomerProfileUncheckedUpdateWithoutOtpChallengesInput>
    create: XOR<CustomerProfileCreateWithoutOtpChallengesInput, CustomerProfileUncheckedCreateWithoutOtpChallengesInput>
    where?: CustomerProfileWhereInput
  }

  export type CustomerProfileUpdateToOneWithWhereWithoutOtpChallengesInput = {
    where?: CustomerProfileWhereInput
    data: XOR<CustomerProfileUpdateWithoutOtpChallengesInput, CustomerProfileUncheckedUpdateWithoutOtpChallengesInput>
  }

  export type CustomerProfileUpdateWithoutOtpChallengesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUpdateManyWithoutCustomerNestedInput
    orderActionRequests?: OrderActionRequestUpdateManyWithoutCustomerProfileNestedInput
  }

  export type CustomerProfileUncheckedUpdateWithoutOtpChallengesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutCustomerNestedInput
    orderActionRequests?: OrderActionRequestUncheckedUpdateManyWithoutCustomerProfileNestedInput
  }

  export type CustomerProfileCreateWithoutOrderActionRequestsInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionCreateNestedManyWithoutCustomerInput
    otpChallenges?: OTPChallengeCreateNestedManyWithoutCustomerInput
  }

  export type CustomerProfileUncheckedCreateWithoutOrderActionRequestsInput = {
    id?: string
    phoneE164: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    stateProvince?: string | null
    postalCode?: string | null
    countryRegion?: string | null
    shopifyCustomerId?: string | null
    phoneVerifiedAt?: Date | string | null
    profileCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutCustomerInput
    otpChallenges?: OTPChallengeUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerProfileCreateOrConnectWithoutOrderActionRequestsInput = {
    where: CustomerProfileWhereUniqueInput
    create: XOR<CustomerProfileCreateWithoutOrderActionRequestsInput, CustomerProfileUncheckedCreateWithoutOrderActionRequestsInput>
  }

  export type OrderActionItemCreateWithoutRequestInput = {
    id?: string
    shopifyLineItemId?: string | null
    productTitle: string
    variantTitle?: string | null
    sku?: string | null
    currentSize?: string | null
    requestedSize: string
    quantity?: number
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrderActionItemUncheckedCreateWithoutRequestInput = {
    id?: string
    shopifyLineItemId?: string | null
    productTitle: string
    variantTitle?: string | null
    sku?: string | null
    currentSize?: string | null
    requestedSize: string
    quantity?: number
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrderActionItemCreateOrConnectWithoutRequestInput = {
    where: OrderActionItemWhereUniqueInput
    create: XOR<OrderActionItemCreateWithoutRequestInput, OrderActionItemUncheckedCreateWithoutRequestInput>
  }

  export type OrderActionItemCreateManyRequestInputEnvelope = {
    data: OrderActionItemCreateManyRequestInput | OrderActionItemCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type RequestPaymentCreateWithoutRequestInput = {
    id?: string
    purpose?: $Enums.PaymentPurpose
    provider?: $Enums.PaymentProvider
    amount: number
    currency?: string
    status?: $Enums.PaymentStatus
    paymentLinkId?: string | null
    paymentLinkUrl?: string | null
    providerReferenceId?: string | null
    paymentId?: string | null
    paidAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestPaymentUncheckedCreateWithoutRequestInput = {
    id?: string
    purpose?: $Enums.PaymentPurpose
    provider?: $Enums.PaymentProvider
    amount: number
    currency?: string
    status?: $Enums.PaymentStatus
    paymentLinkId?: string | null
    paymentLinkUrl?: string | null
    providerReferenceId?: string | null
    paymentId?: string | null
    paidAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestPaymentCreateOrConnectWithoutRequestInput = {
    where: RequestPaymentWhereUniqueInput
    create: XOR<RequestPaymentCreateWithoutRequestInput, RequestPaymentUncheckedCreateWithoutRequestInput>
  }

  export type RequestPaymentCreateManyRequestInputEnvelope = {
    data: RequestPaymentCreateManyRequestInput | RequestPaymentCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentTrackingCreateWithoutRequestInput = {
    id?: string
    direction: $Enums.ShipmentDirection
    carrier?: string | null
    awb?: string | null
    trackingUrl?: string | null
    status?: $Enums.ShipmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentTrackingUncheckedCreateWithoutRequestInput = {
    id?: string
    direction: $Enums.ShipmentDirection
    carrier?: string | null
    awb?: string | null
    trackingUrl?: string | null
    status?: $Enums.ShipmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentTrackingCreateOrConnectWithoutRequestInput = {
    where: ShipmentTrackingWhereUniqueInput
    create: XOR<ShipmentTrackingCreateWithoutRequestInput, ShipmentTrackingUncheckedCreateWithoutRequestInput>
  }

  export type ShipmentTrackingCreateManyRequestInputEnvelope = {
    data: ShipmentTrackingCreateManyRequestInput | ShipmentTrackingCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type CustomerProfileUpsertWithoutOrderActionRequestsInput = {
    update: XOR<CustomerProfileUpdateWithoutOrderActionRequestsInput, CustomerProfileUncheckedUpdateWithoutOrderActionRequestsInput>
    create: XOR<CustomerProfileCreateWithoutOrderActionRequestsInput, CustomerProfileUncheckedCreateWithoutOrderActionRequestsInput>
    where?: CustomerProfileWhereInput
  }

  export type CustomerProfileUpdateToOneWithWhereWithoutOrderActionRequestsInput = {
    where?: CustomerProfileWhereInput
    data: XOR<CustomerProfileUpdateWithoutOrderActionRequestsInput, CustomerProfileUncheckedUpdateWithoutOrderActionRequestsInput>
  }

  export type CustomerProfileUpdateWithoutOrderActionRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUpdateManyWithoutCustomerNestedInput
    otpChallenges?: OTPChallengeUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerProfileUncheckedUpdateWithoutOrderActionRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    countryRegion?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profileCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutCustomerNestedInput
    otpChallenges?: OTPChallengeUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type OrderActionItemUpsertWithWhereUniqueWithoutRequestInput = {
    where: OrderActionItemWhereUniqueInput
    update: XOR<OrderActionItemUpdateWithoutRequestInput, OrderActionItemUncheckedUpdateWithoutRequestInput>
    create: XOR<OrderActionItemCreateWithoutRequestInput, OrderActionItemUncheckedCreateWithoutRequestInput>
  }

  export type OrderActionItemUpdateWithWhereUniqueWithoutRequestInput = {
    where: OrderActionItemWhereUniqueInput
    data: XOR<OrderActionItemUpdateWithoutRequestInput, OrderActionItemUncheckedUpdateWithoutRequestInput>
  }

  export type OrderActionItemUpdateManyWithWhereWithoutRequestInput = {
    where: OrderActionItemScalarWhereInput
    data: XOR<OrderActionItemUpdateManyMutationInput, OrderActionItemUncheckedUpdateManyWithoutRequestInput>
  }

  export type OrderActionItemScalarWhereInput = {
    AND?: OrderActionItemScalarWhereInput | OrderActionItemScalarWhereInput[]
    OR?: OrderActionItemScalarWhereInput[]
    NOT?: OrderActionItemScalarWhereInput | OrderActionItemScalarWhereInput[]
    id?: StringFilter<"OrderActionItem"> | string
    requestId?: StringFilter<"OrderActionItem"> | string
    shopifyLineItemId?: StringNullableFilter<"OrderActionItem"> | string | null
    productTitle?: StringFilter<"OrderActionItem"> | string
    variantTitle?: StringNullableFilter<"OrderActionItem"> | string | null
    sku?: StringNullableFilter<"OrderActionItem"> | string | null
    currentSize?: StringNullableFilter<"OrderActionItem"> | string | null
    requestedSize?: StringFilter<"OrderActionItem"> | string
    quantity?: IntFilter<"OrderActionItem"> | number
    isClearance?: BoolFilter<"OrderActionItem"> | boolean
    isExcludedCategory?: BoolFilter<"OrderActionItem"> | boolean
    eligibilitySnapshot?: JsonNullableFilter<"OrderActionItem">
    createdAt?: DateTimeFilter<"OrderActionItem"> | Date | string
  }

  export type RequestPaymentUpsertWithWhereUniqueWithoutRequestInput = {
    where: RequestPaymentWhereUniqueInput
    update: XOR<RequestPaymentUpdateWithoutRequestInput, RequestPaymentUncheckedUpdateWithoutRequestInput>
    create: XOR<RequestPaymentCreateWithoutRequestInput, RequestPaymentUncheckedCreateWithoutRequestInput>
  }

  export type RequestPaymentUpdateWithWhereUniqueWithoutRequestInput = {
    where: RequestPaymentWhereUniqueInput
    data: XOR<RequestPaymentUpdateWithoutRequestInput, RequestPaymentUncheckedUpdateWithoutRequestInput>
  }

  export type RequestPaymentUpdateManyWithWhereWithoutRequestInput = {
    where: RequestPaymentScalarWhereInput
    data: XOR<RequestPaymentUpdateManyMutationInput, RequestPaymentUncheckedUpdateManyWithoutRequestInput>
  }

  export type RequestPaymentScalarWhereInput = {
    AND?: RequestPaymentScalarWhereInput | RequestPaymentScalarWhereInput[]
    OR?: RequestPaymentScalarWhereInput[]
    NOT?: RequestPaymentScalarWhereInput | RequestPaymentScalarWhereInput[]
    id?: StringFilter<"RequestPayment"> | string
    requestId?: StringFilter<"RequestPayment"> | string
    purpose?: EnumPaymentPurposeFilter<"RequestPayment"> | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFilter<"RequestPayment"> | $Enums.PaymentProvider
    amount?: IntFilter<"RequestPayment"> | number
    currency?: StringFilter<"RequestPayment"> | string
    status?: EnumPaymentStatusFilter<"RequestPayment"> | $Enums.PaymentStatus
    paymentLinkId?: StringNullableFilter<"RequestPayment"> | string | null
    paymentLinkUrl?: StringNullableFilter<"RequestPayment"> | string | null
    providerReferenceId?: StringNullableFilter<"RequestPayment"> | string | null
    paymentId?: StringNullableFilter<"RequestPayment"> | string | null
    paidAt?: DateTimeNullableFilter<"RequestPayment"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"RequestPayment"> | Date | string | null
    createdAt?: DateTimeFilter<"RequestPayment"> | Date | string
    updatedAt?: DateTimeFilter<"RequestPayment"> | Date | string
  }

  export type ShipmentTrackingUpsertWithWhereUniqueWithoutRequestInput = {
    where: ShipmentTrackingWhereUniqueInput
    update: XOR<ShipmentTrackingUpdateWithoutRequestInput, ShipmentTrackingUncheckedUpdateWithoutRequestInput>
    create: XOR<ShipmentTrackingCreateWithoutRequestInput, ShipmentTrackingUncheckedCreateWithoutRequestInput>
  }

  export type ShipmentTrackingUpdateWithWhereUniqueWithoutRequestInput = {
    where: ShipmentTrackingWhereUniqueInput
    data: XOR<ShipmentTrackingUpdateWithoutRequestInput, ShipmentTrackingUncheckedUpdateWithoutRequestInput>
  }

  export type ShipmentTrackingUpdateManyWithWhereWithoutRequestInput = {
    where: ShipmentTrackingScalarWhereInput
    data: XOR<ShipmentTrackingUpdateManyMutationInput, ShipmentTrackingUncheckedUpdateManyWithoutRequestInput>
  }

  export type ShipmentTrackingScalarWhereInput = {
    AND?: ShipmentTrackingScalarWhereInput | ShipmentTrackingScalarWhereInput[]
    OR?: ShipmentTrackingScalarWhereInput[]
    NOT?: ShipmentTrackingScalarWhereInput | ShipmentTrackingScalarWhereInput[]
    id?: StringFilter<"ShipmentTracking"> | string
    requestId?: StringFilter<"ShipmentTracking"> | string
    direction?: EnumShipmentDirectionFilter<"ShipmentTracking"> | $Enums.ShipmentDirection
    carrier?: StringNullableFilter<"ShipmentTracking"> | string | null
    awb?: StringNullableFilter<"ShipmentTracking"> | string | null
    trackingUrl?: StringNullableFilter<"ShipmentTracking"> | string | null
    status?: EnumShipmentStatusFilter<"ShipmentTracking"> | $Enums.ShipmentStatus
    createdAt?: DateTimeFilter<"ShipmentTracking"> | Date | string
    updatedAt?: DateTimeFilter<"ShipmentTracking"> | Date | string
  }

  export type OrderActionRequestCreateWithoutItemsInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    customerProfile: CustomerProfileCreateNestedOneWithoutOrderActionRequestsInput
    payments?: RequestPaymentCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestUncheckedCreateWithoutItemsInput = {
    id?: string
    requestType?: $Enums.RequestType
    customerProfileId: string
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    payments?: RequestPaymentUncheckedCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestCreateOrConnectWithoutItemsInput = {
    where: OrderActionRequestWhereUniqueInput
    create: XOR<OrderActionRequestCreateWithoutItemsInput, OrderActionRequestUncheckedCreateWithoutItemsInput>
  }

  export type OrderActionRequestUpsertWithoutItemsInput = {
    update: XOR<OrderActionRequestUpdateWithoutItemsInput, OrderActionRequestUncheckedUpdateWithoutItemsInput>
    create: XOR<OrderActionRequestCreateWithoutItemsInput, OrderActionRequestUncheckedCreateWithoutItemsInput>
    where?: OrderActionRequestWhereInput
  }

  export type OrderActionRequestUpdateToOneWithWhereWithoutItemsInput = {
    where?: OrderActionRequestWhereInput
    data: XOR<OrderActionRequestUpdateWithoutItemsInput, OrderActionRequestUncheckedUpdateWithoutItemsInput>
  }

  export type OrderActionRequestUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    customerProfile?: CustomerProfileUpdateOneRequiredWithoutOrderActionRequestsNestedInput
    payments?: RequestPaymentUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    customerProfileId?: StringFieldUpdateOperationsInput | string
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    payments?: RequestPaymentUncheckedUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestCreateWithoutPaymentsInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    customerProfile: CustomerProfileCreateNestedOneWithoutOrderActionRequestsInput
    items?: OrderActionItemCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestUncheckedCreateWithoutPaymentsInput = {
    id?: string
    requestType?: $Enums.RequestType
    customerProfileId: string
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    items?: OrderActionItemUncheckedCreateNestedManyWithoutRequestInput
    shipments?: ShipmentTrackingUncheckedCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestCreateOrConnectWithoutPaymentsInput = {
    where: OrderActionRequestWhereUniqueInput
    create: XOR<OrderActionRequestCreateWithoutPaymentsInput, OrderActionRequestUncheckedCreateWithoutPaymentsInput>
  }

  export type OrderActionRequestUpsertWithoutPaymentsInput = {
    update: XOR<OrderActionRequestUpdateWithoutPaymentsInput, OrderActionRequestUncheckedUpdateWithoutPaymentsInput>
    create: XOR<OrderActionRequestCreateWithoutPaymentsInput, OrderActionRequestUncheckedCreateWithoutPaymentsInput>
    where?: OrderActionRequestWhereInput
  }

  export type OrderActionRequestUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: OrderActionRequestWhereInput
    data: XOR<OrderActionRequestUpdateWithoutPaymentsInput, OrderActionRequestUncheckedUpdateWithoutPaymentsInput>
  }

  export type OrderActionRequestUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    customerProfile?: CustomerProfileUpdateOneRequiredWithoutOrderActionRequestsNestedInput
    items?: OrderActionItemUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    customerProfileId?: StringFieldUpdateOperationsInput | string
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    items?: OrderActionItemUncheckedUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestCreateWithoutShipmentsInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    customerProfile: CustomerProfileCreateNestedOneWithoutOrderActionRequestsInput
    items?: OrderActionItemCreateNestedManyWithoutRequestInput
    payments?: RequestPaymentCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestUncheckedCreateWithoutShipmentsInput = {
    id?: string
    requestType?: $Enums.RequestType
    customerProfileId: string
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
    items?: OrderActionItemUncheckedCreateNestedManyWithoutRequestInput
    payments?: RequestPaymentUncheckedCreateNestedManyWithoutRequestInput
  }

  export type OrderActionRequestCreateOrConnectWithoutShipmentsInput = {
    where: OrderActionRequestWhereUniqueInput
    create: XOR<OrderActionRequestCreateWithoutShipmentsInput, OrderActionRequestUncheckedCreateWithoutShipmentsInput>
  }

  export type OrderActionRequestUpsertWithoutShipmentsInput = {
    update: XOR<OrderActionRequestUpdateWithoutShipmentsInput, OrderActionRequestUncheckedUpdateWithoutShipmentsInput>
    create: XOR<OrderActionRequestCreateWithoutShipmentsInput, OrderActionRequestUncheckedCreateWithoutShipmentsInput>
    where?: OrderActionRequestWhereInput
  }

  export type OrderActionRequestUpdateToOneWithWhereWithoutShipmentsInput = {
    where?: OrderActionRequestWhereInput
    data: XOR<OrderActionRequestUpdateWithoutShipmentsInput, OrderActionRequestUncheckedUpdateWithoutShipmentsInput>
  }

  export type OrderActionRequestUpdateWithoutShipmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    customerProfile?: CustomerProfileUpdateOneRequiredWithoutOrderActionRequestsNestedInput
    items?: OrderActionItemUpdateManyWithoutRequestNestedInput
    payments?: RequestPaymentUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestUncheckedUpdateWithoutShipmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    customerProfileId?: StringFieldUpdateOperationsInput | string
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    items?: OrderActionItemUncheckedUpdateManyWithoutRequestNestedInput
    payments?: RequestPaymentUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type AuthSessionCreateManyCustomerInput = {
    id?: string
    sessionTokenHash: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OTPChallengeCreateManyCustomerInput = {
    id?: string
    phoneE164: string
    provider: string
    providerSid?: string | null
    status: string
    attemptsCount?: number
    requestedAt?: Date | string
    verifiedAt?: Date | string | null
    expiresAt: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrderActionRequestCreateManyCustomerProfileInput = {
    id?: string
    requestType?: $Enums.RequestType
    shopifyCustomerId?: string | null
    shopifyOrderId?: string | null
    orderNumber: string
    status?: $Enums.ExchangeRequestStatus
    reason?: string | null
    customerNote?: string | null
    adminNote?: string | null
    requestedAt?: Date | string
    updatedAt?: Date | string
    customerNameSnapshot?: string | null
    customerPhoneSnapshot?: string | null
    customerEmailSnapshot?: string | null
    orderAmountSnapshot?: string | null
    deliveryDateSnapshot?: Date | string | null
    eligibilityDecision?: string | null
    eligibilityReason?: string | null
  }

  export type AuthSessionUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionTokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPChallengeUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPChallengeUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OTPChallengeUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneE164?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerSid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    attemptsCount?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderActionRequestUpdateWithoutCustomerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    items?: OrderActionItemUpdateManyWithoutRequestNestedInput
    payments?: RequestPaymentUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestUncheckedUpdateWithoutCustomerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
    items?: OrderActionItemUncheckedUpdateManyWithoutRequestNestedInput
    payments?: RequestPaymentUncheckedUpdateManyWithoutRequestNestedInput
    shipments?: ShipmentTrackingUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type OrderActionRequestUncheckedUpdateManyWithoutCustomerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumRequestTypeFieldUpdateOperationsInput | $Enums.RequestType
    shopifyCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumExchangeRequestStatusFieldUpdateOperationsInput | $Enums.ExchangeRequestStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    customerNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerNameSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhoneSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmailSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    orderAmountSnapshot?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDateSnapshot?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eligibilityDecision?: NullableStringFieldUpdateOperationsInput | string | null
    eligibilityReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderActionItemCreateManyRequestInput = {
    id?: string
    shopifyLineItemId?: string | null
    productTitle: string
    variantTitle?: string | null
    sku?: string | null
    currentSize?: string | null
    requestedSize: string
    quantity?: number
    isClearance?: boolean
    isExcludedCategory?: boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RequestPaymentCreateManyRequestInput = {
    id?: string
    purpose?: $Enums.PaymentPurpose
    provider?: $Enums.PaymentProvider
    amount: number
    currency?: string
    status?: $Enums.PaymentStatus
    paymentLinkId?: string | null
    paymentLinkUrl?: string | null
    providerReferenceId?: string | null
    paymentId?: string | null
    paidAt?: Date | string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentTrackingCreateManyRequestInput = {
    id?: string
    direction: $Enums.ShipmentDirection
    carrier?: string | null
    awb?: string | null
    trackingUrl?: string | null
    status?: $Enums.ShipmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderActionItemUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderActionItemUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderActionItemUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifyLineItemId?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: StringFieldUpdateOperationsInput | string
    variantTitle?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    currentSize?: NullableStringFieldUpdateOperationsInput | string | null
    requestedSize?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    isClearance?: BoolFieldUpdateOperationsInput | boolean
    isExcludedCategory?: BoolFieldUpdateOperationsInput | boolean
    eligibilitySnapshot?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestPaymentUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestPaymentUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestPaymentUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumPaymentPurposeFieldUpdateOperationsInput | $Enums.PaymentPurpose
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentLinkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    providerReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentTrackingUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentTrackingUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentTrackingUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumShipmentDirectionFieldUpdateOperationsInput | $Enums.ShipmentDirection
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    awb?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}