import { createApp } from "vue";
import App from "./App.vue";
import { VaInput, VaDataTable } from "vuestic-ui"; // <-
import "vuestic-ui/dist/vuestic-ui.css"; // <-

createApp(App)
  .component("va-data-table", VaDataTable)
  .component("va-input", VaInput)
  .mount("#app");
