export default Object.freeze(
  Object.setPrototypeOf(
    {
      ELEMENT: "element",
      CONSOLE: "console",
      APPLICATION: "application",
      NETWORK: "network"
    },
    {
      text(type) {
        switch (type) {
          case this.ELEMENT:
            return "Element";
          case this.CONSOLE:
            return "Console";
          case this.APPLICATION:
            return "Application";
          case this.NETWORK:
            return "Network";
          default:
            return type;
        }
      }
    }
  )
);
