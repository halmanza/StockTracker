<template>
  <div id="stockConsumerContainer">
    <va-input
      placeholder="press ctrl + &darr; to clear"
      v-model="stockInputData"
      label="stockSymbol"
      :rules="[(input) => input.length >= 1 || `Enter valid stock symbol`]"
      v-on:keyup.ctrl.down="resetInputField()"
      v-on:keydown.enter="
        searchStockBySymbol(this.stockInputData.toUpperCase().trim())
      "
    />

    <va-button-toggle
      v-model="filterOptions"
      flat
      size="medium"
      :rounded="false"
      :options="[
        { label: `Search`, value: `search` },
        { label: `Filter`, value: `filter` },
        { label: `Reset`, value: `reset` },
      ]"
    />
  </div>

  <div
    v-if="this.stockHeadingDataStorage.length"
    :class="{ addScroll: this.stockHeadingDataStorage.length }"
  >
    <h3>Ticker History</h3>
    <div
      aria-label="Current Stock Information"
      V-
      v-for="labelData in this.stockHeadingDataStorage"
      :key="labelData"
    >
      <a
        @click="searchStockBySymbol(labelData[`Symbol`])"
        :class="{ addHoverLink: this.stockHeadingDataStorage.length }"
      >
        {{ labelData["Symbol"] }} , Last Refreshed:
        {{ labelData["Refreshed"] }}
      </a>
    </div>
  </div>

  <div
    class="ml-2"
    :class="{ mobile: isMobile, fullColumnSize: isMobile == false }"
  >
    <va-data-table
      :items="stockDataStorage"
      v-if="this.filterOptions !== `filter`"
    />
    <va-data-table
      :items="stockDataStorage"
      v-if="this.filterOptions == `filter`"
      :filter="this.stockInputData"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      stockInputData: "",
      stockFilter: "",
      stockDataStorage: [],
      stockHeadingDataStorage: [],
      screenSize: 0,
      isMobile: false,
      filterOptions: "",
      filter: "",
    };
  },
  beforeUpdate() {
    if (this.stockHeadingDataStorage.length >= 1) {
      this.clearStockHistory();
    }
  },
  watch: {
    screenSize: function (currentScreen, oldValue) {
      this.checkScreenSize < 375
        ? (this.screenSize = currentScreen)
        : (this.screenSize = oldValue);
    },
    filterOptions: function (currentFiltervalue) {
      switch (currentFiltervalue) {
        case "search":
          this.searchStockBySymbol(this.stockInputData.toUpperCase().trim());

          this.filterOptions = "";

          break;

        case "reset":
          this.resetInputField();

          this.filterOptions = "";

          break;

        case "filter":
          this.stockInputData = this.filter;
      }
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
        return error.message;
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
    clearStockHistory() {
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

.addScroll {
  overflow-y: auto;
  color: rgb(255, 251, 251);
}

.addHoverLink:hover {
  color: rgba(45, 201, 240, 0.945);
  cursor: pointer;
}
div.addScroll {
  background: black;
  margin: 0.2rem;
}
</style>
