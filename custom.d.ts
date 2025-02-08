declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
declare module '*.jpg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
declare module '@env' {
  export const BASE_URL: string;
  export const SHERPA_WEB_URL: string;
  export const SENTRY_DSN: string;
  export const CLIENT_ID: string;
  export const PACKET_ID: string;
  export const MAPBOX_ACCESS_TOKEN: string;
  export const NODE_ENV: string;
  export const STRIPE_PUBLISHABLE_KEY: string;
}
