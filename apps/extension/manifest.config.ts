import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  permissions: ["storage", "sidePanel", "tabs", "scripting"],
  host_permissions: ["<all_urls>"],
  side_panel: {
    default_path: "index.html",
  },
});
