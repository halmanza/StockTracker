<template>
  <div id="stockConsumerContainer">
    <va-input
      v-model="stockInputData"
      label="stockSymbol"
      :rules="[(input) => input.length >= 1 || `Enter valid stock symbol`]"
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
      V-
      v-for="labelData in this.stockHeadingDataStorage"
      :key="labelData"
    >
      <a @click="searchStockBySymbol(labelData[`Symbol`])">
        {{ labelData["Symbol"] }} , Last Refreshed:
        {{ labelData["Refreshed"] }}
      </a>
    </div>
  </div>

  <div
    class="ml-2"
    :class="{ mobile: isMobile, fullColumnSize: isMobile == false }"
  >
    <va-data-table :items="stockDataStorage" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      stockInputData: "",
      shortCutNotice: "Hold ctrl + down arrow to clear",
      stockDataStorage: [],
      stockHeadingDataStorage: [],
      screenSize: 0,
      isMobile: false,
    };
  },
  beforeUpdate() {
    if (this.stockHeadingDataStorage.length >= 1) {
      this.clearHeadingStorage();
    }
  },
  watch: {
    screenSize: function (currentScreen, oldValue) {
      this.checkScreenSize < 375
        ? (this.screenSize = currentScreen)
        : (this.screenSize = oldValue);
    },
  },

  computed: {
    displayStockData: function () {
      return this.stockDataStorage.map((item) => {
        return item;
      });
    },
    checkScreenSize: function () {
      return window.innerWidth;
    },
  },
  methods: {
    async searchStockBySymbol(stock) {
      this.stockDataStorage = [];
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
        console.error(error.message);
      }

      this.stockInputData = stock;
    },
    resetInputField() {
      this.stockInputData = "";
      this.stockDataStorage = [];
    },
    setMobileCheck() {
      if (this.checkScreenSize <= 375) {
        this.isMobile = true;
      }
      this.screenSize = this.checkScreenSize;
    },
    clearHeadingStorage() {
      const ids = this.stockHeadingDataStorage.map((item) => item.Symbol);

      this.stockHeadingDataStorage = this.stockHeadingDataStorage.filter(
        ({ Symbol }, index) => !ids.includes(Symbol, index + 1)
      );
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

.fullColumnSize {
  width: 100vw;
}

.mobile {
  font-size: 2px;
}
</style>
