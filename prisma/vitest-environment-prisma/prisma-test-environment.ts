import { Environment } from "vitest";

export default <Environment>{
  name: "prisma",
  async setup() {
    console.log("executou setup");
    return {
      async teardown() {
        console.log("teardown");
      },
    };
  },

  transformMode: "web",
};
