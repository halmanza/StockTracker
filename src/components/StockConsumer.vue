<template>
  <div id="stockConsumerContainer">
    <va-input
      v-model="stockInputData"
      label="stockSymbol"
      :rules="[(input) => input.length >= 1 || `Enter valid stock symbol`]"
      class="m-4"
      v-on:keyup.ctrl.down="resetInputField()"
      v-on:keyup.delete="this.stockInputData === '' ? resetInputField() : null"
      v-on:keydown.enter="
        searchStockBySymbol(this.stockInputData.toUpperCase().trim())
      "
    />
  </div>
  <div v-if="this.stockHeadingDataStorage.length">
    <h3>Ticker History</h3>
    <div
      aria-label="Current Stock Information"
      v-for="labelData in this.stockHeadingDataStorage"
      :key="labelData"
    >
      <link v-on:click="searchStockBySymbol(labelData[`Symbol`])" />{{
        labelData["Symbol"]
      }}
      , Last Refreshed: {{ labelData["Refreshed"] }}<link />
    </div>
  </div>

  <va-data-table :items="stockDataStorage" />
</template>

<script>
export default {
  data() {
    return {
      stockInputData: "",
      shortCutNotice: "Hold ctrl + down arrow to clear",
      stockDataStorage: [],
      stockHeadingDataStorage: [],
    };
  },
  computed: {
    displayStockData: function () {
      return this.stockDataStorage.map((item) => {
        return item;
      });
    },
  },
  methods: {
    async searchStockBySymbol(stock) {
      let StockInfo;

      try {
        let stockFetch = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&interval=5min&apikey=${process.env.API_KEY}`
        );

        StockInfo = await stockFetch.json();

        this.stockHeadingDataStorage.push({
          Symbol: StockInfo["Meta Data"]["2. Symbol"],
          Refreshed: StockInfo["Meta Data"]["3. Last Refreshed"],
        });

        let stockReportDate = StockInfo["Time Series (Daily)"];

        for (const day in stockReportDate) {
          let stockStorageObject = {
            Date: day,
            Open: stockReportDate[day]["1. open"],
            Close: stockReportDate[day]["4. close"],
            High: stockReportDate[day]["2. high"],
            Low: stockReportDate[day]["3. low"],
            Volume: stockReportDate[day]["5. volume"],
          };

          this.stockDataStorage.push(stockStorageObject);
        }
      } catch (error) {
        return error.message;
      }
    },
    resetInputField() {
      this.stockInputData = "";

      this.stockDataStorage = [];
    },
  },
};
</script>

<style scoped>
#stockConsumerContainer {
  display: flex;
  padding: 1rem;
}

.dataStorageArray {
  display: flex;
}
</style>
