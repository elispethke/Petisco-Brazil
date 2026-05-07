// `export type {}` makes this file an ES module, so the declare module block
// below augments firebase/auth rather than replacing its entire declaration.
export type {};

// getReactNativePersistence is only in @firebase/auth's react-native build
// (dist/rn/index.js). Metro resolves it correctly via the "react-native"
// condition at runtime, but TypeScript's bundler resolver always picks the
// "types" condition first, so the export is invisible to the type checker.
// This augmentation bridges that gap without touching runtime behaviour.
declare module 'firebase/auth' {
  export declare function getReactNativePersistence(storage: object): Persistence;
}
