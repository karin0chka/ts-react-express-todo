interface IConfig {
  API: string;
  MODE: boolean;
}

const config: IConfig = {
  API: process.env.REACT_APP_API_URL!,
  MODE: process.env.REACT_APP_DEBUG_MODE === "true",
};

export default config;
